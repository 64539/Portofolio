export function validateEnv() {
  const requiredVars = [
    'ADMIN_SECRET',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'EMAILJS_SERVICE_ID',
    'EMAILJS_TEMPLATE_AUTO_REPLY',
    'EMAILJS_TEMPLATE_ADMIN_REPLY',
    'EMAILJS_PUBLIC_KEY',
    'EMAILJS_PRIVATE_KEY'
  ];

  const missingVars = requiredVars.filter(key => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}
