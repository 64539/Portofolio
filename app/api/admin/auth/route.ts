import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { validateEnv } from '@/lib/env';

export async function POST(request: Request) {
  try {
    // 1. Environment Validation
    try {
      validateEnv();
    } catch (envError) {
      console.error('Server Configuration Error:', envError);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const { password } = await request.json();
    
    // 2. Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const rateLimitKey = `admin:attempts:${ip}`;
    
    const attempts = await redis.incr(rateLimitKey);
    if (attempts === 1) {
      await redis.expire(rateLimitKey, 600); // 10 minutes window
    }

    if (attempts > 5) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // 3. Password Validation
    const adminSecret = process.env.ADMIN_SECRET;
    
    if (password !== adminSecret) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Reset rate limit on success
    await redis.del(rateLimitKey);

    // 4. Session Creation
    const token = crypto.randomUUID();
    const sessionData = {
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    // Store session in Redis (expire in 2 hours)
    await redis.set(`admin:session:${token}`, JSON.stringify(sessionData), { ex: 7200 });

    // 5. Audit Log
    const auditLog = {
      timestamp: Date.now(),
      ip,
      action: 'login_success'
    };
    await redis.lpush('admin:audit', JSON.stringify(auditLog));
    await redis.ltrim('admin:audit', 0, 999); // Keep last 1000 logs

    // 6. Response with Cookie
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7200, // 2 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
