# Rencana Implementasi "Cyber-Admin TUI"

Saya akan merombak total komponen Terminal menjadi antarmuka "Cyber-Admin TUI" yang canggih, menggabungkan estetika retro-futuristik dengan fungsionalitas admin yang kuat. Terminal akan dipindahkan ke section QUICK COMMAND di `ContactHub.tsx` sesuai permintaan.

## Tahap 1: Restrukturisasi & Pemindahan Komponen
1.  **Pindahkan Lokasi Terminal**:
    *   Hapus `<Terminal />` dari `OperationalBase.tsx`.
    *   Pasang `<Terminal />` di dalam section "QUICK COMMAND" pada `ContactHub.tsx`.
2.  **Refactor `Terminal.tsx`**:
    *   Ubah arsitektur menjadi **State-Driven UI**: `mode` ('public' | 'admin'), `view` ('input' | 'receipt' | 'dashboard').
    *   Pisahkan logika menjadi custom hook `useTerminalLogic`.

## Tahap 2: Implementasi Visual & Estetika (TUI)
1.  **Sistem Tema Ganda**:
    *   **Public Mode**: Warna dasar Cyan/Green (`text-cyber-cyan`, `border-cyber-cyan`).
    *   **Admin Mode**: Warna dasar Amber/Orange (`text-amber-500`, `border-amber-500`).
2.  **Elemen UI ASCII & High-Tech**:
    *   Gunakan karakter ASCII (`┌ ─ ┐ │ └ ─ ┘`) untuk membingkai elemen.
    *   Tambahkan efek *scanlines* CSS, *text-glow*, dan *border-glow*.
    *   Implementasi font monospaced (`font-mono`) secara konsisten.

## Tahap 3: Fitur Pengguna (Public Mode)
1.  **Pengiriman Pesan**:
    *   Pertahankan formulir input (Nama, Email, Pesan).
    *   **Post-Submission**: Ganti alert standar dengan **Digital Receipt Card**.
    *   **Animasi**: Tampilkan teks "Transmitting..." dengan efek ketik sebelum menampilkan resi.
    *   **Isi Resi**: Border ASCII, Ticket ID (UUID pendek), Timestamp, Status.

## Tahap 4: Admin Dashboard (Split-View Layout)
1.  **Mekanisme Login**:
    *   Perintah `sudo login` memicu prompt password (input *masked*).
    *   Validasi password `23112311` -> Ubah tema ke Amber -> Buka Dashboard.
2.  **Layout Dashboard (Grid System)**:
    *   **Header**: Statistik Real-time (Total Pesan, Unread).
    *   **Sidebar (Kiri)**: List pesan masuk dengan indikator `[NEW]`/`[READ]`.
    *   **Main Panel (Kanan)**: Detail pesan (Tabel ASCII berisi Metadata + Isi Pesan).
3.  **Navigasi & Kontrol**:
    *   Klik pada list pesan untuk membaca.
    *   Perintah CLI: `inbox`, `read <id>`, `delete <id>`, `clear`, `exit`.

## Tahap 5: Integrasi Supabase Real-time
1.  **Data Fetching**:
    *   Gunakan `SupabaseClient` untuk `subscribe` ke tabel `messages`.
    *   Update counter 'Unread' secara real-time saat ada pesan baru masuk.
2.  **Admin Actions**:
    *   `delete`: Hapus baris dari Supabase.
    *   `read`: Update status `is_read` (jika kolom ada, atau handle secara lokal).

## Rencana Eksekusi
1.  **Modifikasi `Terminal.tsx`**: Terapkan struktur UI baru dan logika TUI.
2.  **Update `ContactHub.tsx`**: Integrasikan Terminal baru.
3.  **Cleanup `OperationalBase.tsx`**: Hapus Terminal lama.
4.  **Styling & Polish**: Pastikan responsivitas (stacking di mobile) dan efek visual.

Apakah Anda setuju dengan rencana ini?