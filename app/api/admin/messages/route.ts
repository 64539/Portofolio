import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    // 1. Get all message IDs from sorted set
    // 'contacts:all' is a sorted set where score is timestamp
    // We get range 0 to -1 to get all, rev=true to get newest first
    const ids = await redis.zrange('contacts:all', 0, -1, { rev: true });

    if (ids.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // 2. Pipeline fetch all hash data
    const pipeline = redis.pipeline();
    ids.forEach((id) => {
      pipeline.hgetall(`contact:${id as string}`);
    });

    const results = await pipeline.exec();
    
    // 3. Format results
    const messages = results.map((msg: any) => ({
      ...msg,
      // Map database field (created_at) to frontend expectation (createdAt)
      createdAt: msg.created_at || Date.now(),
      // Ensure booleans are actually booleans if Redis stored them as strings
      isRead: msg.isRead === true || msg.isRead === 'true',
      autoReplied: msg.autoReplied === true || msg.autoReplied === 'true',
      deleted: msg.deleted === true || msg.deleted === 'true',
    })).filter(msg => !msg.deleted); // Filter out soft-deleted

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch Messages Error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
