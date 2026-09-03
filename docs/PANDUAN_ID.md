# AI Job Search OS — Panduan Pengguna

Kamu tidak perlu paham RAG, database, coding, atau automation. Sistem ini dirancang supaya kamu cukup **ngobrol dengan AI seperti biasa**.

## Yang perlu kamu upload ke Project

1. `SYSTEM.md`
2. `JOB_TRACKER.xlsx`
3. salinan CV terbaru yang sudah dibersihkan dari data pribadi yang tidak perlu

Hapus data yang tidak dibutuhkan AI, misalnya nomor telepon, email pribadi, alamat lengkap, NIK/paspor/NPWP, DOB, dan tanda tangan. Jangan pernah masukkan password, OTP, data rekening, atau kredensial portal lamaran.

## 1. Setup sekali

Setelah semua file di-upload, mulai chat seperti biasa.

AI akan membaca CV sebagai **sumber fakta**, lalu melakukan onboarding untuk memahami arah karier, preference, constraint, dan evidence yang benar-benar kamu miliki. Isi CV tidak otomatis dianggap sebagai arah karier yang kamu inginkan.

Setelah AI merangkum pemahamannya:
1. koreksi kalau ada yang salah;
2. approve kalau sudah akurat;
3. AI membuat `USER_CONTEXT.md`;
4. upload file tersebut kembali ke Project Sources.

Project sekarang masuk **ACTIVE MODE**.

## 2. Minta AI cari kerja

Cukup bilang:

> Cari 20 lowongan yang cocok buat gue.

AI seharusnya langsung melakukan pekerjaan internal yang memang sudah ditentukan workflow: search, verification, official-career-page check, duplicate/history check, fit review, dan gap/evidence analysis.

Kalau kamu menemukan link sendiri, cukup paste:

> Cek ini: [link]

AI harus memproses link tersebut tanpa meminta kamu mengulang perintah untuk setiap tahap.

## 3. Kamu yang sortir

Setelah AI memberi hasil, **kamu tetap decision-maker**.

Contoh:

> A, C, dan F gue pursue. Sisanya drop.

AI harus merekonsiliasi batch tersebut dan memperbarui tracker sejauh platform memungkinkan. Kalau alasan drop spesifik, scope-nya juga harus spesifik. Drop karena lokasi bukan berarti blacklist perusahaan.

`HOLD` tetap non-terminal. Kalau tracker belum punya status Hold khusus, AI menyimpannya sebagai `Review` dengan note/next action HOLD — bukan sebagai Dropped.

## 4. Siapkan application untuk role yang kamu pursue

Contoh:

> Siapin application buat JOB-012.

Kamu tidak perlu menjawab pertanyaan seperti “mau ATS-friendly?”, “PDF atau DOCX?”, atau “1 atau 2 halaman?” kalau default-nya sudah jelas.

Default CV:
- **editable DOCX**;
- ATS-safe;
- single-column;
- section heading konvensional;
- tanpa photo, icon, sidebar, skill bar, infographic, floating text box, atau layout multi-column;
- **1 halaman untuk early/mid-career** bila evidence relevan bisa direpresentasikan dengan jujur;
- 2 halaman hanya kalau experience/seniority memang membutuhkannya;
- terminology dari JD hanya digunakan bila didukung verified evidence;
- tidak boleh mengarang metrics, outcome, deployment, tools, seniority, atau pengalaman demi terlihat lebih cocok.

PDF bukan default. PDF hanya dibuat kalau kamu meminta atau employer memang mewajibkan.

Cover letter, bila required/requested/appropriate untuk application pack, juga default editable DOCX dan maksimal 1 halaman.

Kalau platform tidak bisa membuat DOCX, AI harus menyatakan limitation itu sekali dan memberi fallback editable — bukan diam-diam menggantinya dengan PDF.

## 5. Kamu yang submit

Review/edit dokumen lalu submit sendiri di official ATS perusahaan. Isi data sensitif langsung di sana.

Setelah submit, bilang:

> Gue sudah submit JOB-012.

Baru setelah konfirmasi itu AI boleh menandai role sebagai `Applied`, mencatat applied date/activity/next action, lalu melakukan recruiter/hiring-user enrichment bila belum dilakukan.

## 6. Recruiter & outreach

Deep recruiter research default-nya dilakukan **setelah kamu memilih untuk pursue/apply**, bukan untuk semua search noise.

AI boleh mencari:
1. confirmed job poster/recruiter;
2. recruiter/TA yang relevan;
3. confirmed hiring manager jika ada bukti publik;
4. likely hiring user / functional manager;
5. role-adjacent practitioner.

AI tidak boleh mengarang orang, LinkedIn URL, email, atau reporting line.

AI boleh menyiapkan draft outreach, tetapi **kamu yang review dan mengirimnya**.

## 7. Recruitment process

Kalau ada update, cukup bilang apa yang berubah:

> Gue dapat recruiter screening.

> Gue dapat assessment.

> Gue dipanggil interview.

> Gue ditolak.

> Gue dapat offer.

AI memperbarui stage/history dan, kalau kamu meminta preparation untuk stage tertentu, AI harus langsung mengeksekusinya — bukan kembali menawarkan menu layanan.

## 8. Outcome jadi feedback

- `Dropped` = kamu memutuskan tidak lanjut.
- `Rejected` = perusahaan/proses menolak kamu.
- `Closed` = opportunity tidak lagi tersedia.
- `Offer` = keputusan menerima/menolak tetap milik kamu.

Kalau ada durable preference baru, AI boleh mengusulkan update `USER_CONTEXT.md`, tetapi perubahan canonical tetap membutuhkan approval kamu.

## AI tidak perlu minta izin di setiap micro-step

Human-in-the-loop **bukan** human-in-every-micro-step.

AI boleh otomatis menjalankan pekerjaan internal yang low-risk/reversible. AI hanya perlu bertanya bila jawabannya benar-benar blocking untuk factual correctness, eligibility, privacy, consequential decision, atau external action.

Jadi AI tidak seharusnya terus bertanya:

```text
Mau saya bikin ATS-friendly?
Mau PDF atau DOCX?
Mau saya update tracker?
Mau saya cari recruiternya juga?
Mau saya lanjut?
```

Kalau safe default sudah ada di `SYSTEM.md`, AI harus pakai default tersebut dan lanjut.

## Cara lihat database kamu

Kamu tidak perlu buka Excel setiap hari. Cukup bilang:

> Tampilkan dashboard tracker gue.

Atau:

> Tampilkan lamaran aktif gue.

> Tampilkan lowongan yang belum gue review.

> Analisis pipeline job search gue.

`JOB_TRACKER.xlsx` tetap menjadi database transparan yang bisa kamu audit sendiri.

## Contoh perintah yang cukup

```text
Cari 20 lowongan yang cocok buat gue.
Review ini: [link].
A, C, dan F gue pursue. Sisanya drop.
Siapin application buat JOB-012.
Gue sudah submit JOB-012.
Prepare gue buat recruiter screen.
Tampilkan dashboard tracker gue.
```

File di belakang layar adalah tugas sistem. **Judgment dan external action tetap tugas kamu.**
