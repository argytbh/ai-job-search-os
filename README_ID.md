# AI Job Search OS

**Workflow job search berbasis human-in-the-loop AI untuk membantu kamu mencari, menilai, melacak, dan mengelola lowongan tanpa menyerahkan keputusan akhir ke AI.**

[English version](README.md)

## Sistem ini bisa apa?

AI Job Search OS mengubah AI Project/workspace menjadi partner job search yang lebih terstruktur.

AI dapat:

- mencari lowongan dan menilai fit berdasarkan konteks karier yang sudah kamu approve;
- menerima link lowongan yang kamu temukan sendiri;
- cross-check hasil LinkedIn/job board yang stale ke career page resmi perusahaan;
- mencari role alternatif yang masih live kalau posting awal sudah hilang;
- menjaga job tracker;
- mencari recruiter dan probable hiring user yang relevan;
- membedakan **Dropped** oleh user dengan **Rejected** oleh perusahaan;
- membantu CV, application answer, outreach, interview prep, dan pipeline analysis;
- menyimpan konteks karier durable hanya setelah kamu review dan approve.

Keputusan akhir **APPLY / DROP / HOLD tetap milik kamu**.

## Cara mulai

1. Download [Starter Pack](release/AI-Job-Search-OS-Starter-v1.5.zip).
2. Buat AI Project/workspace baru.
3. Upload:
   - `SYSTEM.md`
   - `JOB_TRACKER.xlsx`
   - **salinan CV terbaru yang sudah disanitasi**
4. Mulai ngobrol seperti biasa.
5. AI akan melakukan onboarding, merangkum pemahamannya, lalu meminta kamu mengoreksi jika ada yang salah.
6. Setelah kamu approve, AI akan membuat `USER_CONTEXT.md`.
7. Upload `USER_CONTEXT.md` kembali ke Project Sources yang sama.

Selesai. Project kamu sudah terinisialisasi.

## Lima perintah yang cukup

```text
Cari lowongan untuk saya.
Review lowongan ini: [link].
Saya apply / drop yang ini.
Cari recruiter atau hiring manager-nya.
Tampilkan dashboard tracker saya.
```

Kamu juga boleh langsung paste link lowongan. Untuk role yang layak, AI seharusnya otomatis melakukan verification, fit review, tracking, dan contact enrichment.

## Freshness lowongan

Hasil AI search, LinkedIn, dan job board **tidak selalu lengkap atau up to date**.

Untuk opportunity penting, selalu cross-check di **career page resmi perusahaan** sebelum apply.

Kalau link yang kamu berikan ternyata stale atau closed, sistem diperintahkan untuk mencari:
1. role yang sama di career page resmi; atau
2. alternatif yang masih live dan relevan di perusahaan yang sama.

AI tidak boleh diam-diam menganggap posting lama masih aktif.

## Privacy

Gunakan salinan CV yang sudah disanitasi. Hapus data pribadi yang tidak dibutuhkan, misalnya:

- nomor telepon;
- email pribadi;
- alamat rumah lengkap;
- tanggal lahir;
- NIK / paspor / NPWP;
- tanda tangan.

Jangan pernah simpan password, OTP, informasi rekening, atau kredensial portal lamaran di project.

Data sensitif yang memang diperlukan perusahaan sebaiknya kamu isi langsung di situs resmi perusahaan.

## Keamanan file

Repository ini **tidak membutuhkan**:

- executable atau installer;
- browser extension;
- API key;
- OAuth;
- plugin;
- background process;
- telemetry.

`SYSTEM.md` hanyalah file teks biasa.

`JOB_TRACKER.xlsx` adalah workbook `.xlsx` macro-free berisi tabel, formula, dropdown, dan formatting untuk tracking/reporting.

Tidak ada executable code yang perlu dijalankan agar workflow ini bisa digunakan.

Kamu tetap dianjurkan memeriksa file sebelum menggunakannya. SHA-256 checksum tersedia di [`SHA256SUMS.txt`](SHA256SUMS.txt).

## Arsitektur

```text
SYSTEM.md
    = HOW — bagaimana AI harus bekerja

USER_CONTEXT.md
    = WHO + WHY — siapa user dan alasan durable di balik keputusan karier
      (baru dibuat setelah onboarding + approval user)

JOB_TRACKER.xlsx
    = WHAT / NOW — apa yang sedang terjadi
      (jobs, contacts, activity, dashboard)

Sanitized CV
    = supporting factual evidence
```

## Human-in-the-loop memory

AI tidak boleh menyimpulkan arah masa depan kamu hanya dari pekerjaan yang tertulis di CV.

Pada penggunaan pertama, AI melakukan interview, menampilkan proposed understanding, lalu menunggu approval sebelum membuat `USER_CONTEXT.md`.

Kalau preference durable berubah di masa depan, AI harus mengusulkan update, meminta approval, lalu membuat replacement `USER_CONTEXT.md`.

## Mau coba tanpa setup dulu?

Kalau AI yang kamu pakai bisa membaca public GitHub repository/page, kamu bisa kasih link repository ini lalu bilang:

```text
Baca SYSTEM.md dari repository ini dan jelaskan cara kerja AI Job Search OS ini.
```

Ini cocok untuk inspeksi atau coba cepat.

Untuk penggunaan rutin dan tracking personal yang lebih reliable, upload starter files langsung ke Project/workspace.

## Struktur repository

```text
.
├── README.md
├── README_ID.md
├── LICENSE
├── SECURITY.md
├── CHANGELOG.md
├── SHA256SUMS.txt
├── starter/
│   ├── SYSTEM.md
│   └── JOB_TRACKER.xlsx
├── release/
│   └── AI-Job-Search-OS-Starter-v1.5.zip
└── docs/
    ├── index.html
    ├── style.css
    ├── PANDUAN_ID.md
    └── downloads/
```

## Lisensi

Dirilis menggunakan [MIT License](LICENSE).

## Prinsip utama

> AI seharusnya memperbesar kemampuan manusia untuk mencari, mengingat, membandingkan, dan menganalisis — bukan menggantikan human judgment.
