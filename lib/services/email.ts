import { getPackageById, formatCurrency } from '@/lib/packages';

export interface EmailContact {
  name: string;
  email: string;
  message: string;
  packageType: string;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
}

const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

async function sendEmail(templateId: string, templateParams: Record<string, unknown>): Promise<EmailResponse> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Using Private Key for server-side requests

  if (!serviceId || !publicKey || !templateId || !privateKey) {
    console.error('EmailJS configuration missing');
    return { success: false, error: 'Configuration missing' };
  }

  try {
    const response = await fetch(EMAILJS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey, // Required for secure server-side sending
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS Error:', errorText);
      return { success: false, error: `EmailJS failed: ${response.status} ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    console.error('EmailJS Network Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export const emailService = {
  async sendAutoReply(contact: EmailContact): Promise<EmailResponse> {
    const templateId = process.env.EMAILJS_TEMPLATE_AUTO_REPLY;
    if (!templateId) return { success: false, error: 'Auto-reply template ID missing' };

    const pkg = getPackageById(contact.packageType);
    const packageName = pkg ? pkg.title : 'General Inquiry';

    // Matches user's new HTML template variables
    const params = {
      name: contact.name,       // {{name}}
      to_email: contact.email,  // Required for routing
      title: packageName,       // {{title}}
      message: contact.message, // {{message}}
    };

    return sendEmail(templateId, params);
  },

  async sendAdminReply(contact: EmailContact, replyMessage: string, ticketId: string): Promise<EmailResponse> {
    const templateId = process.env.EMAILJS_TEMPLATE_ADMIN_REPLY;
    if (!templateId) return { success: false, error: 'Admin reply template ID missing' };

    // Matches user's new HTML template variables
    const params = {
      to_name: contact.name,     // {{to_name}}
      to_email: contact.email,   // Required for routing
      admin_reply: replyMessage, // {{admin_reply}}
      ticket_id: ticketId,       // {{ticket_id}}
    };

    return sendEmail(templateId, params);
  }
};
