# Scraper Emas & Perak

Proyek ini digunakan untuk melakukan _scraping_ harga **emas** dari [Pluang](https://pluang.com) dan harga **perak** dari [harga-emas.org](https://harga-emas.org/perak/), lalu menampilkannya melalui server Node.js.

---

## 📦 Fitur

- Ambil data harga emas terkini dari Pluang.
- Ambil data harga perak dari harga-emas.org.
- Otomatis memperbarui data secara berkala.
- Siap digunakan dalam sistem backend (REST API, monitoring, dll).

---

## ⚙️ Persyaratan

- Node.js v18+
- Puppeteer (sudah di-handle otomatis oleh `npm install`)
- Sistem berbasis Linux (disarankan) atau Docker

---

## 🚀 Cara Menjalankan

# 1. Clone repositori ini
`git clone https://github.com/username/nama-proyek.git`
`cd nama-proyek`

# 2. Install dependensi
`npm install`

# 3. Jalankan server
`node server.js`

Server akan mulai berjalan dan mengambil data emas serta perak secara periodik.

---
## 📄 Lisensi

Proyek ini bersifat open-source dan dapat digunakan untuk keperluan edukasi atau pribadi. Cek file LICENSE untuk detail.

---
## 🙋 FAQ

Q: Data tidak muncul?
A: Pastikan server tidak diblokir oleh situs target, dan semua dependensi Puppeteer terinstal.

Q: Bisa di-deploy ke Easypanel?
A: Ya, bisa. Pastikan dependensi seperti libgbm1 tersedia di Docker image kamu.