# Mulai AI Job Search OS

Folder ini adalah workspace job search pribadi milik pengguna. Baca `AGENTS.md`, lalu lakukan pemeriksaan setup yang dijelaskan di sana.

Jangan meminta pengguna memahami struktur folder. Setelah setup terverifikasi, jelaskan hasilnya secara singkat dan mulai onboarding jika `profile/USER_CONTEXT.md` belum ada.

Jika mode tracker adalah `local_json`, setelah setup berhasil beri tahu sekali bahwa pengguna dapat membuka `BUKA_DASHBOARD.html` di Chrome atau Edge, memilih folder workspace ini, lalu melihat dan mengubah status tracker tanpa bertanya ke agent. Dashboard dan agent memakai `data/tracker.json` yang sama.

Jika pesan handoff menyebut Google Sheets, ikuti alur `google_sheets` di Skill: siapkan folder lokal lebih dulu, lalu jelaskan proses otorisasi dan pembuatan tracker secara lengkap, detail, dan terstruktur per tahap. Berhenti hanya ketika pengguna perlu melakukan otorisasi melalui layar resmi Google. Jangan minta password atau kode login. Jangan mengklaim tracker siap sebelum akses create/read/write ke Sheet terbukti dan `data/tracker.config.json` sudah diverifikasi. Dalam mode ini, arahkan pengguna ke Sheet sebagai tracker live, bukan dashboard JSON lokal.
