# AI Job Search OS — Panduan Pengguna

Kamu tidak perlu paham RAG, database, coding, atau automation.

Sistem ini dirancang supaya kamu cukup **ngobrol dengan AI seperti biasa**.

## Yang perlu kamu upload ke Project

1. `SYSTEM.md`
2. `JOB_TRACKER.xlsx`
3. salinan CV terbaru yang sudah dibersihkan dari data pribadi yang tidak perlu

Jangan upload CV master kalau masih berisi data sensitif yang tidak dibutuhkan AI.

Hapus dulu, misalnya:
- nomor telepon;
- email pribadi;
- alamat lengkap;
- NIK / paspor / NPWP;
- tanda tangan.

Jangan pernah masukkan password, OTP, data rekening, atau kredensial portal lamaran.

## Cara mulai

Setelah semua file di-upload, mulai chat seperti biasa.

Contoh:

> Halo

atau:

> Mulai job search saya.

AI akan melihat bahwa profilmu belum tersimpan dan mulai onboarding.

AI akan:
1. membaca CV sebagai sumber fakta;
2. bertanya tentang arah karier yang kamu inginkan;
3. menggali role/perusahaan/industri yang kamu suka atau hindari;
4. memahami kekuatan, gap, dan pengalaman yang bisa jadi evidence;
5. merangkum pemahamannya;
6. meminta kamu mengoreksi kalau ada yang salah.

Setelah kamu bilang pemahamannya sudah benar, AI akan membuat file:

`USER_CONTEXT.md`

Download file tersebut lalu upload kembali ke Project Sources.

**Selesai. Project kamu sekarang sudah terinisialisasi.**

## Setelah itu cukup ngobrol

### Minta AI cari kerja
> Cari lowongan untuk saya.

### Kamu menemukan link sendiri
Paste saja:

> Cek ini: [link]

AI seharusnya otomatis:
- mengecek apakah posting masih aktif;
- mencari versi resmi di career page perusahaan;
- review fit;
- masukin role yang layak ke tracker;
- mencari recruiter dan probable hiring user.

Kalau link LinkedIn/job board ternyata outdated, AI akan mencoba mencari role yang sama atau alternatif yang masih live di career page resmi perusahaan.

Tetap cross-check lowongan penting sebelum apply karena hasil AI, LinkedIn, dan job board tidak selalu up to date.

### Setelah apply
Submit sendiri di situs resmi perusahaan lalu bilang:

> Saya sudah apply hari ini.

### Kalau drop
> Drop yang ini. Terlalu sales.

atau:

> Drop yang ini. Company-nya bagus, tapi lokasi kantor ini terlalu jauh.

AI harus menjaga alasan tersebut dengan scope yang benar dan tidak asal mem-blacklist seluruh perusahaan.

### Kalau ada update
> Saya dapat recruiter screening.

> Saya dapat interview.

> Saya ditolak.

> Saya dapat offer.

## Cara lihat database kamu

Kamu tidak perlu buka Excel setiap hari.

Cukup bilang:

> **Tampilkan dashboard tracker saya.**

Atau:

> Tampilkan lamaran aktif saya.

> Tampilkan lowongan yang belum saya review.

> Tampilkan recruiter yang sudah tersimpan.

> Tampilkan riwayat JOB-012.

> Analisis pipeline job search saya.

AI akan menampilkan data tracker langsung di chat.

`JOB_TRACKER.xlsx` tetap ada sebagai database transparan di belakang layar kalau kamu ingin mengeceknya sendiri.

## Siapa yang mengambil keputusan?

**Kamu.**

AI boleh memberi verdict APPLY / CONDITIONAL / DROP, tetapi keputusan final tetap milikmu.

- `Dropped` = kamu yang memutuskan tidak lanjut.
- `Rejected` = perusahaan yang menolak.
- `Closed` = lowongan/proses sudah tidak tersedia.

## Kalau preference kamu berubah

Contoh:

> Mulai sekarang jangan rekomendasikan role yang punya sales quota.

AI akan memakai preference baru tersebut langsung.

Kalau perubahan durable sudah cukup penting, AI akan meminta approval lalu membuat versi baru `USER_CONTEXT.md`.

Kamu cukup replace file lama di Project Sources.

## Lima kalimat yang cukup

1. **Cari lowongan untuk saya.**
2. **Review ini: [link].**
3. **Saya apply / drop yang ini.**
4. **Cari recruiter atau hiring manager-nya.**
5. **Tampilkan dashboard tracker saya.**

Itu saja. File di belakang layar adalah tugas sistem, bukan tugas kamu.
