# Vision Document
## Proyek: GSI One Mobile Application

---

## 1. Visi Sistem

**"Menjadi platform digital terdepan yang menghubungkan PT Graha Survei Indonesia dengan kliennya, sehingga setiap proses dari pemesanan survei hingga pemantauan progres proyek dapat dilakukan secara transparan, cepat, dan mudah melalui genggaman tangan."**

---

## 2. Tujuan Sistem

1. Mempercepat proses pemesanan survey lapangan dari rata-rata 3 hari menjadi < 1 jam.
2. Memberikan transparansi penuh kepada klien mengenai progres proyek yang sedang berjalan.
3. Meningkatkan profesionalitas dan citra PT GSI di mata klien melalui teknologi digital.
4. Membangun basis data klien yang terstruktur sebagai aset pemasaran jangka panjang.

---

## 3. Pengguna Target

| Kelompok Pengguna | Kebutuhan Utama                                           |
| ----------------- | --------------------------------------------------------- |
| Klien korporat    | Booking survei mudah, pantau progres, unduh laporan       |
| Tim Marketing GSI | Presentasi layanan digital, kelola relasi klien           |
| Engineer GSI      | Update progres lapangan, upload foto dan laporan          |
| Administrator GSI | Kelola data proyek, pengguna, dan dokumen                 |

---

## 4. Lingkungan Sistem

Aplikasi berjalan di atas infrastruktur berikut:
- **Frontend**: React Native (Android & iOS)
- **Backend**: Supabase (PostgreSQL, Storage, Authentication)
- **Network**: HTTPS terenkripsi
- **Hosting API tambahan**: `https://grahasurvei.com` (PHP-based legacy API)
