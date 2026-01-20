# Pudak News CMS

Admin panel sederhana untuk mengelola berita perusahaan.

## Persiapan

1. Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).
2. Masuk ke direktori `server`:
   ```bash
   cd server
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Setup Database (SQLite):
   ```bash
   npx prisma migrate dev --name init
   ```
5. Buat akun admin pertama:
   ```bash
   node seed.js
   ```

## Menjalankan Server

Di dalam direktori `server`, jalankan:
```bash
node index.js
```
Server akan berjalan di `http://localhost:3000`.

## Menjalankan Admin Panel

1. Buka folder `admin` di browser Anda.
2. Login dengan:
   - **Username:** admin
   - **Password:** password123

## Catatan untuk GitHub Codespaces

Jika Anda menggunakan GitHub Codespaces, pastikan:
1. Port 3000 diatur menjadi 'Public' di tab Ports.
2. Di file `admin/app.js`, pastikan `API_URL` mengarah ke URL publik dari port 3000 tersebut.
