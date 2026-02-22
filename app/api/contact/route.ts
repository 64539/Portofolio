import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { emailService } from '@/lib/services/email';
import { validateEnv } from '@/lib/env';

export async function POST(request: Request) {
  try {
    // 0. Ensure environment is valid
    try {
      validateEnv();
    } catch (error) {
      console.error('Environment Error:', error);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, message, packageType } = body;

    // 1. Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { error: 'Message is too long (max 10,000 characters)' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 2. Rate Limiting (Redis based)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const rateLimitKey = `ratelimit:contact:${ip}`;
    
    const currentRequests = await redis.incr(rateLimitKey);
    if (currentRequests === 1) {
      await redis.expire(rateLimitKey, 3600); // 1 hour
    }

    if (currentRequests > 5) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 3. Database Insert (Redis)
    const id = crypto.randomUUID();
    const timestamp = Date.now();
    const contactData = {
      id,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      packageType: packageType || 'general-inquiry',
      status: 'pending',
      created_at: timestamp,
      autoReplied: false,
      ip_address: ip
    };

    // Atomic transaction: Save Data + Update Indexes
    const pipeline = redis.pipeline();
    pipeline.hset(`contact:${id}`, contactData);
    pipeline.zadd('contacts:index:all', { score: timestamp, member: id });
    pipeline.sadd('contacts:index:pending', id);
    // Also add to old key for backward compatibility if needed, but we are moving to new schema.
    // However, the admin dashboard reads from 'contacts:all' (ZSET).
    // Let's keep 'contacts:all' for now to ensure admin dashboard works immediately without refactoring IT too.
    pipeline.zadd('contacts:all', { score: timestamp, member: id }); 
    
    const results = await pipeline.exec();

    // Check for pipeline failure
    if (!results) {
        throw new Error('Redis pipeline failed');
    }

    // 4. Send Auto-Reply Email
    // Only proceed if DB insert was successful
    let emailStatus = 'skipped';
    try {
      const emailRes = await emailService.sendAutoReply({
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
        packageType: contactData.packageType
      });

      if (emailRes.success) {
        // Update DB to reflect email sent
        await redis.hset(`contact:${id}`, { autoReplied: true });
        emailStatus = 'sent';
      } else {
        console.error('Auto-reply failed:', emailRes.error);
        emailStatus = 'failed';
        // We do NOT fail the request here, as the message is saved.
      }
    } catch (emailError) {
      console.error('Email Service Error:', emailError);
      emailStatus = 'error';
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        id,
        emailStatus
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
