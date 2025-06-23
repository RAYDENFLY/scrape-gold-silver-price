const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function scrapeHargaEmas() {
    const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://pluang.com/widgets/price-graph/desktop-vertical', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.col-md-12.floatLeft.wdgt__mtBtn.no__pd.width-100');

    const hargaSell = await page.$eval(
      'a[data-type="sell-gold-price"]',
      el => el.previousElementSibling.textContent.trim()
    );

    const hargaBuy = await page.$eval(
      'a[data-type="buy-gold-price"]',
      el => el.previousElementSibling.textContent.trim()
    );
    
    // Fungsi bantu untuk ubah ke angka bulat tanpa Rp dan titik
    function toBulat(str) {
    return parseInt(
        str
        .replace(/Rp|\./g, '')  // hilangkan Rp dan titik
        .replace(/,/g, '')      // hilangkan koma (kalau ada)
        .trim()
    );
    }

        return {
    sellBulat: toBulat(hargaSell),    // misal 1820740
    buyBulat: toBulat(hargaBuy), // misal 1877052
    sell: hargaSell.replace(/\s*\/g\s*/g, '').trim(),
    buy: hargaBuy.replace(/\s*\/g\s*/g, '').trim()
    };

  } catch (error) {
    console.error('Error saat scrape emas:', error);
    return null;
  } finally {
    await browser.close();
  }
}

async function scrapeHargaPerak() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://harga-emas.org/perak/', { waitUntil: 'networkidle2' });

                const hargaPerak = await page.evaluate(() => {
            const table = document.querySelector('table');
            if (!table) return null;

            const rows = table.querySelectorAll('tbody tr');
            const row = rows[5]; // Baris ke-6 = index 5
            const kolomHarga = row?.querySelectorAll('td')[1];

            if (!kolomHarga) return null;

            // Ambil teks dan bersihkan
            const teks = kolomHarga.textContent
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/[↑↓]/g, '')
                .trim(); // contoh: "17.571,26"

            // Ubah ke angka bulat: "17.571,26" -> "17571"
            const angkaBulat = Math.round(
                parseFloat(teks.replace(/\./g, '').replace(',', '.'))
            );

            return {
                asli: teks,
                bulat: angkaBulat
            };
            });

    if (!hargaPerak) throw new Error('Harga perak tidak ditemukan');

    return { perak: hargaPerak };
  } catch (error) {
    console.error('Error saat scrape perak:', error);
    return null;
  } finally {
    await browser.close();
  }
}


let cachedHarga = null;

async function updateHargaPeriodik() {
  try {
    const [emas, perak] = await Promise.all([
      scrapeHargaEmas(),
      scrapeHargaPerak()
    ]);

    if (emas && perak) {
      cachedHarga = {
        emas,
        perak: perak.perak
      };
      console.log('Harga diupdate:', cachedHarga);
    }
  } catch (err) {
    console.error('Error saat update harga periodik:', err);
  }
}

// Jalankan update awal dan interval
updateHargaPeriodik();
setInterval(updateHargaPeriodik, 60000);

app.get('/api/harga-emas', (req, res) => {
  if (!cachedHarga) {
    return res.status(503).json({ error: 'Data harga belum tersedia, coba lagi sebentar.' });
  }
  res.json(cachedHarga);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
