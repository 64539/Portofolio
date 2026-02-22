# 🚀 Modern High-Conversion Portfolio

A high-performance, secure, and conversion-focused portfolio website built with Next.js 14, Tailwind CSS, and Upstash Redis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Upstash Redis](https://img.shields.io/badge/Upstash-Redis-green)

## ✨ Key Features

- **Modern & Minimalist Design:** Dark navy theme with electric blue accents, designed for high conversion.
- **Hidden Admin Dashboard:** Secure, hidden access via a unique interaction pattern (5 clicks on Send button with empty fields).
- **Real-time Content Management:** Manage messages and inquiries via a protected admin dashboard.
- **Serverless Architecture:** Powered by Upstash Redis for speed and scalability.
- **Email Integration:** Automated email notifications via EmailJS.
- **Performance Optimized:** Lighthouse score target 95+, optimized images, and fast load times.
- **Secure Authentication:** Redis-backed session management with IP rate limiting and HttpOnly cookies.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Upstash Redis](https://upstash.com/)
- **Email:** [EmailJS](https://www.emailjs.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/64539/portofolio.git
    cd portofolio
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add the following variables (see `.env.example`):

    ```env
    # Admin Access
    ADMIN_SECRET=your-secure-password

    # Upstash Redis
    UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
    UPSTASH_REDIS_REST_TOKEN=your-redis-token

    # EmailJS
    EMAILJS_SERVICE_ID=your_service_id
    EMAILJS_TEMPLATE_AUTO_REPLY=your_auto_reply_template_id
    EMAILJS_TEMPLATE_ADMIN_REPLY=your_admin_reply_template_id
    EMAILJS_PUBLIC_KEY=your_public_key
    EMAILJS_PRIVATE_KEY=your_private_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Admin Access Guide

The admin dashboard is hidden from public view. To access it:

1.  Go to the **Contact** section.
2.  Ensure all form fields are **empty**.
3.  Click the **"Send Message"** button **5 times** rapidly (within 2 seconds).
4.  Enter your `ADMIN_SECRET` in the modal that appears.

## 🤝 Contribution

Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
