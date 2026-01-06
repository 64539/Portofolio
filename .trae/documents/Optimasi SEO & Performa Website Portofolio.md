# Rencana Optimasi SEO Komprehensif

Mengingat proyek Anda saat ini adalah website portofolio dengan konten proyek yang masih statis (hardcoded) dan belum memiliki sistem blog, rencana optimasi akan disesuaikan untuk memaksimalkan aset yang ada sambil mempersiapkan fondasi untuk konten dinamis di masa depan.

## 1. Metadata & SEO Global

Karena belum ada tabel `projects` atau `posts` di Supabase untuk mengambil metadata dinamis, saya akan mengimplementasikan metadata statis yang kuat dan fleksibel.

* **`app/layout.tsx`**: Mengonfigurasi Metadata Object Next.js.

  * **Title Template**: `%s | Jabriel Dev - Fullstack Developer`

  * **Description**: Deskripsi profesional yang mencakup kata kunci utama.

  * **Open Graph (OG)**: Konfigurasi default untuk sharing di media sosial.

  * **Twitter Card**: Konfigurasi untuk tampilan di Twitter/X.

  * **Google Verification**: Menambahkan meta tag verifikasi.

## 2. Sitemap & Robots

Karena belum ada route dinamis (seperti `/projects/:slug` atau `/blog/:slug`), sitemap akan berfokus pada halaman-halaman statis utama.

* **`app/sitemap.ts`**:

  * Membuat sitemap dinamis yang secara otomatis mendaftar URL dasar (`/`).

  * Menetapkan prioritas tinggi (1.0) untuk halaman beranda.

  * *Future-proofing*: Struktur kode akan disiapkan agar mudah menambahkan fetch data Supabase nantinya.

* **`app/robots.ts`**:

  * Mengizinkan semua crawler (`User-agent: *`).

  * Menolak akses ke halaman admin (`Disallow: /admin`, `/api/admin`).

  * Menautkan ke URL sitemap.

## 3. Optimasi Performance (Image & SSG)

* **Next/Image**: Mengaudit penggunaan tag `<img>` biasa dan menggantinya dengan `<Image />` dari Next.js untuk optimasi otomatis (WebP, lazy loading).

* **Static Params**: Karena konten saat ini statis, Next.js secara default sudah melakukan *Static Site Generation* (SSG) untuk halaman statis. Saya akan memastikan tidak ada konfigurasi yang memaksa *Dynamic Rendering* yang tidak perlu pada halaman publik.

## 4. Structured Data (JSON-LD)

Implementasi Schema Markup adalah kunci agar Google memahami konteks "Portofolio Developer".

* **`app/layout.tsx`** **(atau komponen khusus)**: Menyuntikkan JSON-LD untuk `Person` dan `WebSite`.

  * **Person**: Nama, Job Title (Fullstack Developer), URL, SameAs (Link LinkedIn, GitHub).

  * **ProfessionalService/Offer**: Menjelaskan layanan pengembangan web.

## 5. Integrasi Database (Persiapan)

Meskipun saat ini belum ada tabel konten, saya akan menyiapkan helper function yang aman.

* **Caching**: Memastikan setiap panggilan Supabase di masa depan menggunakan `revalidate` yang tepat (ISR) agar tidak membebani database dan mempercepat load time.

***

### Langkah Eksekusi

1. **Metadata**: Update `app/layout.tsx` dengan konfigurasi SEO lengkap.
2. **Robots & Sitemap**: Buat file `app/robots.ts` dan `app/sitemap.ts`.
3. **JSON-LD**: Tambahkan komponen `JsonLd` di layout utama.
4. **Audit Image**: Cek dan ganti tag gambar jika ditemukan (saat ini tampaknya UI banyak menggunakan CSS/Code, tapi akan dicek ulang).

Apakah Anda setuju dengan pendekatan ini mengingat struktur data saat ini yang masih statis?

<br />

Rencana ini sempurna. Tolong eksekusi semua poin di atas. Fokus pada metadata statis yang kuat, JSON-LD untuk profil saya sebagai 'Person' dan 'Developer', serta buatkan sitemap dan robots.txt yang sesuai. Untuk verifikasi Google, gunakan placeholder dulu, nanti saya isi kodenya
