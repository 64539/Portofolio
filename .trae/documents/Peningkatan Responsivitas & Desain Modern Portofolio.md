Saya telah menganalisis codebase Anda dan menyiapkan rencana komprehensif untuk meningkatkan responsivitas, desain UI/UX, dan performa sesuai permintaan Anda.

## 🚀 Rencana Implementasi

### 1. Desain UI/UX & Fitur Responsif
*   **Komponen `Navbar` Baru (Mobile & Desktop):**
    *   Membuat komponen `Navbar.tsx` yang *sticky* (menempel di atas) dengan efek *glassmorphism*.
    *   **Desktop:** Menu horizontal yang bersih dengan tipografi *mono-spaced*.
    *   **Mobile:** Menu "Hamburger" yang membuka *drawer* navigasi halus (framer-motion).
    *   Navigasi akan menghubungkan section: Home, Skills, Projects, Base, Contact.
*   **Typography & Spacing:**
    *   Mengaudit `globals.css` untuk memastikan konsistensi font (`Syne` untuk heading, `Inter` untuk body, `Fira Code` untuk data).
    *   Menambahkan utilitas padding responsif standar agar konten tidak terlalu mepet ke tepi layar pada perangkat mobile.

### 2. Optimasi Performa (Lighthouse Focus)
*   **Lazy Loading Komponen Berat:**
    *   Mengubah import `SystemDiagnosticModal` di `Hero.tsx` menjadi `next/dynamic` agar kode JS modal hanya di-download saat pengguna membutuhkannya.
    *   Memastikan `CyberMap` (Peta) tetap dimuat secara dinamis (sudah bagus, akan dipertahankan).
*   **Render Blocking & Smooth Scroll:**
    *   Menambahkan properti CSS `scroll-behavior: smooth` secara global.
    *   Memastikan aset font dimuat dengan strategi yang benar (`next/font` sudah digunakan dengan baik).

### 3. Aksesibilitas (Accessibility/a11y)
*   **Kontras & Label:**
    *   Memastikan warna teks *cyan/blue* di atas *background* hitam memiliki rasio kontras yang cukup.
    *   Menambahkan `aria-label` pada tombol-tombol ikon (seperti di terminal atau sosial media) agar terbaca oleh *screen reader*.

### 4. Testing & Verifikasi
*   **Cross-Browser Check:** Memastikan layout Flexbox/Grid berjalan baik di Safari (iOS) dan Chrome (Android).
*   **Verification:** Menjalankan `npm run build` untuk memastikan tidak ada error tipe atau *build* akibat perubahan baru.

Apakah Anda setuju dengan rencana ini untuk mulai dieksekusi?