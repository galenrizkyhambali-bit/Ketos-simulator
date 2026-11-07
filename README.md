# Ketua OSIS Simulator 3D

Game open world sekolah (Babylon.js via CDN) tanpa build, tanpa npm, tanpa backend.

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub, lalu upload semua isi folder ini (index.html, style.css, semua .js, assets/, README.md).
2. Settings > Pages > Source: **Deploy from a branch** > Branch `main` / `(root)` > Save.
3. Buka `https://USERNAME.github.io/NAMA-REPO/` setelah build Pages selesai (1-2 menit).

Main lokal: buka `index.html` di browser (butuh internet untuk memuat Babylon.js).

## Kontrol
- PC: WASD gerak, klik layar untuk mengunci kamera lalu gerakkan mouse, Shift lari, Space lompat, E interaksi, Esc jeda.
- Android: joystick kiri, geser layar kanan untuk kamera, tombol LARI (toggle), LOMPAT, dan tombol interaksi oranye.

## Cara bermain
Game Baru > buat karakter > ikuti misi di pojok kanan atas (6 misi): temui kepala sekolah, ke Ruang OSIS, rapat di meja rapat (E), minta persetujuan dana, minta anggota OSIS memulai kegiatan, lalu lihat acara berlangsung di lapangan upacara. Waktu mengikuti WIB nyata; tombol "+1 Jam" di menu jeda mempercepat waktu. Progres tersimpan otomatis di LocalStorage.

## Modul
`world.js` dunia & pintu · `player.js` karakter, kontrol, kamera · `npc.js` NPC, jadwal, dialog · `osis.js` anggota, rapat, proker, event, misi · `game.js` loop, waktu, HUD, simpan/muat.

## Belum ada (tahap berikutnya)
Smartphone virtual, tangga/lantai 2, rekrut/keluarkan anggota, kustomisasi sekolah, event berdasarkan tanggal, lebih banyak proker dan misi.
