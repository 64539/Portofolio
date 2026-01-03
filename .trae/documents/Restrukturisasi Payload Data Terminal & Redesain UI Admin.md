# Rencana Implementasi Perbaikan Terminal & Admin Dashboard

Berdasarkan permintaan Anda, saya akan merombak implementasi data handling dan tampilan UI admin.

## 1. 💾 Perbaikan Data Payload (Pengiriman Pesan)
**Tujuan:** Memastikan data dikirim secara dinamis (bukan hardcoded) dan tersimpan terstruktur.

*   **Modifikasi `Terminal.tsx` (Public Mode):**
    *   Hapus string hardcoded `"Message via Terminal"`.
    *   Ambil nilai pesan dari state `inputBuffer` (apa yang diketik user di terminal sebelum menekan Enter).
    *   Ambil `name` dan `email` dari state `userDetails` (dari modal verifikasi).
    *   Pastikan payload JSON yang dikirim ke `content` memuat struktur lengkap:
        ```json
        {
            "name": userDetails.name,
            "email": userDetails.email,
            "message": inputBuffer,
            "timestamp": new Date().toISOString()
        }
        ```
*   **Validasi Input:**
    *   Pastikan `inputBuffer` tidak kosong.
    *   Validasi format email dengan Regex sebelum kirim.

## 2. 🖥️ Pembenahan UI Admin (Data Display)
**Tujuan:** Tampilan yang bersih, informatif, dan mudah dibaca tanpa raw JSON.

*   **Sidebar (List Pesan):**
    *   Tampilkan **Nama Pengirim** (Bold, Medium).
    *   Tampilkan **Email** di bawah nama (Opacity 50%, Small).
    *   **Hapus ID UUID** dari tampilan list.
    *   Urutkan list berdasarkan `created_at` DESC (Terbaru di atas) - *Sudah dihandle di query Supabase, akan dipastikan di render*.

*   **Main Panel (Detail Pesan - Clean Decryption View):**
    *   **Parsing JSON:** Parse string JSON dari kolom `content` menjadi objek JavaScript.
    *   **Tampilan Terformat:** Render data dengan label rapi tanpa kurung kurawal/tanda petik:
        *   `[SENDER]`: Nama
        *   `[CONTACT]`: Email
        *   `[TIMESTAMP]`: DD/MM/YYYY HH:mm
        *   `[MESSAGE]`: Isi Pesan (dengan *whitespace-pre-wrap*)
    *   **Styling:** Terapkan tema Amber/Orange, background gelap, border subtle sesuai instruksi.

## 3. 🔢 Logic Reply & Indexing
**Tujuan:** Menggunakan sistem index sederhana (1, 2, 3...) untuk interaksi admin alih-alih UUID panjang.

*   **Implementasi Indexing:**
    *   Di `useTerminalLogic`, tambahkan properti `index` (urutan visual) pada setiap pesan saat di-fetch.
    *   Simpan mapping `index -> message_id` di state lokal (`messageMap`).
*   **Perintah Baru:**
    *   `reply <index>`: Cari ID asli dari mapping index, lalu isi buffer dengan template reply.
    *   `delete <index>`: Cari ID asli, lalu eksekusi penghapusan.
    *   Hapus eksposur UUID di UI, gunakan nomor urut pesan (misal: `#1`, `#2`).

## 4. 🛠️ Struktur Kode & Requirements
*   **Refactoring:**
    *   Pindahkan logika parsing pesan ke fungsi utilitas terpisah atau *memoized value*.
    *   Buat komponen kecil `MessageDetailView` untuk memisahkan rendering detail dari logika terminal utama.
*   **Interface TypeScript:** Perbarui interface `Message` untuk mendukung properti `index` (opsional/frontend-only).

Apakah Anda menyetujui rencana ini?