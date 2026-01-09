# 🌐 Jabriel Srizki Arjati - Secure Fullstack Developer Portfolio

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Status](https://img.shields.io/badge/System-Online-green)

Selamat datang di **Cyberpunk Portfolio** milik Jabriel Srizki Arjati. Proyek ini bukan sekadar portofolio biasa, melainkan sebuah **Terminal User Interface (TUI)** berbasis web yang interaktif, menggabungkan estetika futuristik dengan keamanan tingkat tinggi dan performa modern.

---

## 🚀 Fitur Utama

### 💻 Cyber-Admin Terminal
Fitur unggulan berupa terminal interaktif yang berfungsi penuh:
- **Mode Tamu**: Pengunjung dapat mengirim pesan terenkripsi melalui terminal.
- **Mode Admin**: Akses root tersembunyi (`sudo login`) untuk manajemen konten.
- **Perintah Kustom**: Mendukung perintah seperti `help`, `clear`, `inbox`, `read`, `reply`, dan `delete`.
- **Efek Visual**: Glitch text, scanlines, dan animasi typing ala retro-hacking.

### 🛡️ Keamanan & Integrasi
- **Secure Authentication**: Sistem login berbasis token untuk akses admin.
- **Supabase Integration**: Penyimpanan data pesan yang aman dan *real-time*.
- **Email Notifications**: Integrasi dengan **Resend** untuk notifikasi dan balasan email otomatis.

### ⚡ Performa & SEO
- **Next.js 14 App Router**: Routing sisi server yang cepat dan efisien.
- **SEO Optimized**: Metadata dinamis, JSON-LD Schema, dan sitemap XML otomatis.
- **Responsive Design**: Tampilan adaptif untuk desktop dan mobile.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Email**: [Resend](https://resend.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Instalasi & Konfigurasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lokal:

### 1. Clone Repository
```bash
git clone https://github.com/64539/portofolio.git
cd portofolio
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root direktori dan tambahkan variabel berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Authentication
NEXT_PUBLIC_ADMIN_SECRET_KEY=your_secure_admin_password

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📖 Panduan Penggunaan Terminal

### Untuk Pengunjung (Guest)
1. Ketik pesan Anda di prompt terminal `>`.
2. Tekan **Enter**.
3. Isi nama dan email pada modal verifikasi.
4. Pesan akan dikirim secara aman ke database admin.

### Untuk Admin (Root Access)
1. Ketik perintah: `sudo login`
2. Masukkan password admin (sesuai `.env`).
3. Setelah masuk, gunakan perintah berikut:
   - `inbox`: Melihat daftar pesan masuk.
   - `read <id>`: Membaca detail pesan.
   - `reply <id> <pesan>`: Membalas pesan via email.
   - `delete <id>`: Menghapus pesan.
   - `clean`: Menghapus semua pesan yang sudah dibaca.
   - `stats`: Melihat statistik pesan.

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan ikuti langkah ini:
1. Fork repository ini.
2. Buat branch fitur baru (`git checkout -b fitur-keren`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4. Push ke branch (`git push origin fitur-keren`).
5. Buat Pull Request.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<div align="center">
  Built with 💻 & ☕ by <a href="https://github.com/64539">Jabriel Srizki Arjati</a>
</div>
