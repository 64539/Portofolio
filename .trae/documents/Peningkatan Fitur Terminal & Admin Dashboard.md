# Rencana Implementasi Peningkatan Fitur Terminal & Admin

Saya akan melakukan serangkaian perbaikan dan penambahan fitur sesuai permintaan Anda, dengan fokus pada penyempurnaan interaksi admin dan konsistensi data.

## 1. 💬 Fungsi Reply & Input Pre-filling
*   **Terminal.tsx**:
    *   Mengimplementasikan handler pada tombol `REPLY` di UI Admin.
    *   Saat diklik, tombol ini akan mengisi otomatis *buffer* input terminal dengan format: `reply <ID> ` (ID diambil dari pesan yang sedang dibuka).
    *   Fokus otomatis akan dipindahkan ke input terminal agar admin bisa langsung mengetik pesan balasan.

## 2. 🗑️ Fungsi Delete dengan Konfirmasi UI
*   **Terminal.tsx**:
    *   Menghubungkan tombol `DELETE` di UI dengan fungsi konfirmasi browser (`confirm()`).
    *   Jika dikonfirmasi, akan memanggil fungsi `processCommand(`delete ${id}`)` yang sudah ada di hook logika.

## 3. 📝 Format Pesan & Parsing JSON Konsisten
*   **useTerminalLogic.ts**:
    *   Memastikan saat pesan dikirim (`public mode`), format JSON yang dikirim ke database konsisten dengan struktur yang diminta:
        ```json
        {
          "id": "UUID",
          "from": "Guest Name",
          "email": "email@example.com",
          "timestamp": "ISO String",
          "text": "Message content",
          "status": "UNREAD"
        }
        ```
    *   **Catatan:** Karena database `messages` memiliki kolom terpisah (`sender_name`, `sender_email`, `content`), saya akan menyimpan metadata ini di kolom masing-masing agar mudah di-query, namun juga memastikan kolom `content` menyimpan *payload* lengkap jika diperlukan untuk konsistensi tampilan "Raw JSON".

## 4. 👀 Fitur "Mark as Read" Otomatis
*   **useTerminalLogic.ts**:
    *   Memodifikasi fungsi `setSelectedMessage` (atau membuat fungsi wrapper `openMessage`).
    *   Saat pesan dibuka/diklik:
        *   Cek jika `is_read` masih `false`.
        *   Jika ya, kirim request `PATCH` ke API (perlu endpoint baru atau modifikasi endpoint admin yang ada) untuk update status menjadi `true`.
        *   Update state lokal secara optimistik agar UI langsung berubah (hilangkan badge "NEW").

## 5. 🔍 Filter & Sortir Pesan
*   **useTerminalLogic.ts**:
    *   Menambahkan state `filter` ('ALL' | 'UNREAD' | 'READ').
    *   Menambahkan fungsi helper untuk memfilter `messages` sebelum dirender di sidebar.
*   **Terminal.tsx**:
    *   Menambahkan UI Dropdown/Tabs kecil di atas sidebar untuk memilih filter.

## 6. 🎨 Tata Letak & Placeholder Email
*   **Terminal.tsx**:
    *   Memperbaiki tampilan "Detail Pesan" agar sesuai desain:
        *   Header jelas: FROM, EMAIL, TIMESTAMP.
        *   Body pesan terpisah dari metadata.
        *   Indikator status READ/UNREAD yang jelas.
    *   Memastikan input email di modal verifikasi memiliki placeholder yang diminta.

## Rencana Eksekusi
1.  **Backend (API)**: Update `route.ts` admin untuk mendukung method `PATCH` (update status read).
2.  **Hook Logic**: Implementasi logika filter, update status read, dan format pesan standar.
3.  **UI Component**: Sambungkan tombol Reply/Delete, tambahkan kontrol filter, dan rapikan layout detail pesan.

Apakah Anda setuju dengan rencana ini?