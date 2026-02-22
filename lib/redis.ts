import { Redis } from '@upstash/redis';

// Initialize Redis client with fallback for build time to prevent errors
// when env vars are missing during build
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://example.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'example_token',
});

export default redis;

/*
Data Model & Schema v2.0
========================

1. Contact Ticket (Hash)
   Key: contact:{id}
   Fields:
     - id: string (UUID)
     - name: string
     - email: string
     - packageType: string
     - message: string
     - status: 'pending' | 'responded'
     - created_at: number (timestamp)
     - autoReplied: boolean
     - admin_reply: string (optional)
     - responded_at: number (optional)

2. Indexes (for efficient querying)
   
   a. All Contacts (Sorted Set)
      Key: contacts:index:all
      Score: created_at timestamp
      Member: id

   b. Pending Tickets (Set)
      Key: contacts:index:pending
      Member: id

   c. Responded Tickets (Set)
      Key: contacts:index:responded
      Member: id

3. Admin Session
   Key: admin:session:{token}
   Value: JSON String { createdAt: number, lastActivity: number }
   TTL: 7200s (2 hours)

4. Rate Limiting
   Key: ratelimit:contact:{ip}
   Value: number (count)
   TTL: 3600s (1 hour)
*/
