import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://example.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'example_token',
});

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith('/internal-dashboard') || path.startsWith('/api/admin')) {
    // Exclude auth route from protection
    if (path === '/api/admin/auth') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
       if (path.startsWith('/api/')) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
       }
       return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify token in Redis
    const sessionDataStr = await redis.get(`admin:session:${token}`);
    
    if (!sessionDataStr) {
        const response = path.startsWith('/api/') 
            ? NextResponse.json({ error: 'Session expired' }, { status: 401 })
            : NextResponse.redirect(new URL('/', request.url));
            
        response.cookies.delete('admin_session');
        return response;
    }

    // Advanced Security: Inactivity Timeout & Session Refresh
    try {
        const sessionData = typeof sessionDataStr === 'string' ? JSON.parse(sessionDataStr) : sessionDataStr;
        const now = Date.now();
        const lastActivity = sessionData.lastActivity || sessionData.createdAt;
        
        // Auto Logout after 30 minutes of inactivity
        if (now - lastActivity > 30 * 60 * 1000) {
            await redis.del(`admin:session:${token}`);
            const response = path.startsWith('/api/') 
                ? NextResponse.json({ error: 'Session timed out' }, { status: 401 })
                : NextResponse.redirect(new URL('/', request.url));
            
            response.cookies.delete('admin_session');
            return response;
        }

        // Update Last Activity (Session Refresh)
        // Only update if more than 1 minute passed to reduce write load
        if (now - lastActivity > 60 * 1000) {
            sessionData.lastActivity = now;
            await redis.set(`admin:session:${token}`, JSON.stringify(sessionData), { ex: 7200 }); // Extend TTL
        }

    } catch (e) {
        // If parsing fails, invalidate
        const response = path.startsWith('/api/') 
            ? NextResponse.json({ error: 'Session error' }, { status: 401 })
            : NextResponse.redirect(new URL('/', request.url));
        return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/internal-dashboard/:path*',
    '/api/admin/:path*',
  ],
};
