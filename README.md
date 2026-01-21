# Pudak News CMS

Admin panel sederhana untuk mengelola berita perusahaan.

## Persiapan

1. Buka Terminal.
2. Masuk ke direktori `server`:
   ```bash
   cd server
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Setup Database:
   - File ini sudah diset menggunakan **PostgreSQL** untuk hosting.
   - Jika ingin mencoba lokal (SQLite), ubah `provider` di `prisma/schema.prisma` menjadi `sqlite` dan `url` menjadi `"file:./dev.db"`.
5. Jalankan migrasi & seed:
   ```bash
   npx prisma migrate dev --name init
   node seed.js
   ```

## Menjalankan Server

Di dalam direktori `server`, jalankan:
```bash
node index.js
```

## Integrasi dengan Website Utama

Saya telah menyediakan script di folder `client-scripts/` yang bisa Anda gunakan untuk menampilkan berita di website utama perusahaan.

## Panduan Hosting Gratis (Tanpa Kartu Kredit)

Agar website Anda bisa diakses 24 jam secara gratis:

### 1. Database & Image Storage (Supabase)
1.  Daftar di [Supabase.com](https://supabase.com/) (Gratis, tanpa kartu kredit).
2.  Buat Project baru.
3.  **Database URL:** Klik tombol **"Connect"** di Dashboard, pilih tab **"ORM" (Prisma)**, salin URL-nya. Ini untuk `DATABASE_URL`.
4.  **Image Storage:** Masuk ke menu **Storage** (ikon ember) -> **New Bucket**. Beri nama: `news-images`. Set menjadi **Public**.
5.  **API Keys:** Masuk ke **Settings -> API**. Salin **Project URL** dan **anon public key**. Ini untuk `SUPABASE_URL` dan `SUPABASE_KEY`.

### 2. Backend (Vercel) - REKOMENDASI
Vercel sangat stabil dan tidak meminta kartu kredit untuk penggunaan hobi.
1.  Daftar di [Vercel.com](https://vercel.com/) pakai akun GitHub.
2.  Klik **"Add New"** -> **"Project"**. Impor repositori Anda.
3.  **Root Directory:** Pilih folder `server`.
4.  Tambahkan **Environment Variables**:
    - `DATABASE_URL`: (Dari Supabase)
    - `SUPABASE_URL`: (Dari Supabase API Settings)
    - `SUPABASE_KEY`: (Dari Supabase API Settings)
    - `JWT_SECRET`: (Kode rahasia buatan Anda)
5.  Klik **Deploy**.

## Catatan untuk GitHub Codespaces

Jika Anda menggunakan GitHub Codespaces, pastikan:
1. Port 3000 diatur menjadi 'Public' di tab Ports.
2. Di file `admin/app.js`, pastikan `API_URL` sudah benar.
