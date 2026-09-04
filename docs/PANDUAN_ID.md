# AI Job Search OS — Panduan Pengguna

Kamu tidak perlu paham Git, database, coding, atau terminal. Setup dimulai lewat AI chat yang sudah kamu kenal, lalu AI memandu kamu membuka Personal Workspace di agent desktop.

## Yang perlu kamu download

Versi v1.6.0 adalah rilis stabil. [Hasil pengujian](../VALIDATION.md) membedakan validasi paket dari pengujian aplikasi AI nyata; jalur Codex sudah diuji, sedangkan agent lain belum diverifikasi.

1. `MULAI_DI_SINI.md` untuk di-upload ke AI chat yang sekarang kamu pakai.
2. `AI-Job-Search-Personal-Workspace.zip` ketika AI chat memintanya.
3. Salinan CV terbaru yang sudah dibersihkan, lalu simpan di folder `profile/` setelah workspace siap.

Gunakan akun AI yang kamu buat sendiri dan hanya kamu yang bisa akses. Jangan gunakan akun bersama, sewaan, reseller, atau marketplace untuk workspace pribadi. Hapus data CV yang tidak dibutuhkan dan jangan masukkan password, OTP, data rekening, atau kredensial portal lamaran.

## 1. Setup sekali

Upload `MULAI_DI_SINI.md` ke AI chat dan bilang **Bantu saya mulai**. AI memberi satu langkah setiap kali: gunakan komputer, konfirmasi akun pribadi, install aplikasi resmi, download Personal Workspace, lalu buka foldernya di Codex, Claude Code, Antigravity IDE, Cursor, atau agent lokal yang tersedia.

Kamu tidak perlu akun GitHub, clone repository, branch, atau command line. Pilih agent yang dapat membuka folder di komputermu: Codex untuk akun ChatGPT, Antigravity IDE untuk akun Google/Gemini, Cursor, atau Claude Code untuk akun Claude. Work, Cowork, ChatGPT Projects, Add files, dan Project Sources bukan koneksi database lokal. Setelah folder terbuka di agent lokal, agent harus membuat dan membaca kembali `data/SETUP_STATUS.json` sebelum mengatakan setup berhasil.

AI akan membaca CV sebagai **sumber fakta**, lalu melakukan onboarding untuk memahami arah karier, preference, constraint, dan evidence yang benar-benar kamu miliki. Isi CV tidak otomatis dianggap sebagai arah karier yang kamu inginkan.

Setelah AI merangkum pemahamannya:
1. koreksi kalau ada yang salah;
2. approve kalau sudah akurat;
3. AI menyimpan `profile/USER_CONTEXT.md`;
4. AI membaca kembali file tersebut untuk memastikan sudah tersimpan.

Workspace sekarang masuk **ACTIVE MODE**.

Gunakan folder yang sama pada sesi berikutnya. Agent membaca context dan tracker terbaru tanpa mengulang onboarding. Tanpa browsing, berikan teks JD dan anggap status lowongan belum terverifikasi. Tanpa pembuatan DOCX, AI memberikan fallback editable dan menjelaskan keterbatasannya.

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

`HOLD` tetap non-terminal dan disimpan sebagai `Hold`, bukan `Dropped`.

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

Kalau safe default sudah ada di Skill atau `PORTABLE_WORKFLOW.md`, AI harus pakai default tersebut dan lanjut.

## Cara lihat database kamu

Kamu tidak perlu buka Excel setiap hari. Cukup bilang:

> Tampilkan dashboard tracker gue.

Atau:

> Tampilkan lamaran aktif gue.

> Tampilkan lowongan yang belum gue review.

> Analisis pipeline job search gue.

`data/tracker.json` menjadi database transparan yang dijaga agent. Ringkasan yang mudah dibaca tersedia di `reports/DASHBOARD.md`; XLSX/CSV dapat dibuat sebagai ekspor bila dibutuhkan.

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
