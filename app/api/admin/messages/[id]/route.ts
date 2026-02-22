import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Mark as read in Hash
    await redis.hset(`contact:${id}`, { isRead: true });
    
    // Remove from unread sorted set
    await redis.zrem('contacts:unread', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Soft delete
    await redis.hset(`contact:${id}`, { deleted: true });
    
    // Remove from lists
    await redis.zrem('contacts:all', id);
    await redis.zrem('contacts:unread', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
