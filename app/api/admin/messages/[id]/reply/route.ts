import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { emailService } from '@/lib/services/email';
import { validateEnv } from '@/lib/env';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { message: replyMessage } = body;

    if (!replyMessage?.trim()) {
      return NextResponse.json(
        { error: 'Reply message is required' },
        { status: 400 }
      );
    }

    // 1. Fetch Contact
    const contact = await redis.hgetall(`contact:${id}`) as Record<string, any>;
    
    if (!contact || Object.keys(contact).length === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // 2. Check Status (Prevent double reply)
    if (contact.status === 'responded') {
      return NextResponse.json(
        { error: 'Ticket already responded' },
        { status: 400 }
      );
    }

    // 3. Send Email Reply
    const emailRes = await emailService.sendAdminReply(
      {
        name: contact.name,
        email: contact.email,
        message: contact.message,
        packageType: contact.packageType
      },
      replyMessage,
      id // Pass ticket ID (UUID) directly
    );

    if (!emailRes.success) {
      return NextResponse.json(
        { error: `Failed to send email: ${emailRes.error}` },
        { status: 500 }
      );
    }

    // 4. Update Database (Atomic)
    const timestamp = Date.now();
    const pipeline = redis.pipeline();

    // Update Contact Status & Reply Info
    pipeline.hset(`contact:${id}`, {
      status: 'responded',
      admin_reply: replyMessage,
      responded_at: timestamp,
      replied: true, // For backward compatibility
      replyAt: timestamp // For backward compatibility
    });

    // Move from Pending to Responded Set
    pipeline.srem('contacts:index:pending', id);
    pipeline.sadd('contacts:index:responded', id);
    pipeline.zrem('contacts:unread', id); // Legacy

    await pipeline.exec();

    return NextResponse.json({ success: true, message: 'Reply sent successfully' });

  } catch (error) {
    console.error('Reply API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
