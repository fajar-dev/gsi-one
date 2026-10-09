# Git Workflow
## Proyek: GSI One Mobile Application

---

## 1. Strategi Branching

Proyek menggunakan model **GitHub Flow** yang disederhanakan:

```
main          ← Production-ready branch, selalu stabil
  └── develop ← Branch integrasi harian
        ├── feature/auth-login
        ├── feature/book-survey
        ├── feature/project-tracking
        └── fix/booking-form-validation
```

---

## 2. Aturan Branch

| Branch       | Tujuan                                | Siapa yang merge? |
| ------------ | ------------------------------------- | ----------------- |
| `main`       | Kode production yang sudah diuji      | PM / Lead Dev via PR |
| `develop`    | Integrasi fitur aktif                 | Developer via PR  |
| `feature/*`  | Pengembangan fitur baru               | Developer sendiri |
| `fix/*`      | Perbaikan bug                         | Developer sendiri |
| `hotfix/*`   | Perbaikan mendesak di production      | Lead Dev          |

---

## 3. Konvensi Pesan Commit

Format: `<type>(<scope>): <deskripsi singkat>`

| Type       | Penggunaan                                     |
| ---------- | ---------------------------------------------- |
| `feat`     | Menambahkan fitur baru                         |
| `fix`      | Memperbaiki bug                                |
| `docs`     | Perubahan dokumentasi saja                     |
| `style`    | Perubahan formatting, tidak ada logika berubah |
| `refactor` | Refactoring kode tanpa mengubah perilaku       |
| `test`     | Menambah atau mengubah test                    |
| `chore`    | Update dependency, konfigurasi build, dll.     |

**Contoh commit yang baik:**
```
feat(auth): add login with token persistence to AsyncStorage
fix(booking): prevent form submission when date is not selected
docs(readme): update local setup instructions
```

---

## 4. Alur Pull Request (PR)

1. Developer membuat branch baru dari `develop`.
2. Developer mengerjakan fitur/fix dan melakukan commit secara atomik.
3. Developer membuat Pull Request ke `develop` saat pekerjaan selesai.
4. PR wajib memiliki: deskripsi singkat, screenshot/video (untuk perubahan UI), dan checklist testing.
5. Minimal 1 reviewer (Lead Developer) menyetujui sebelum merge.
6. PR di-merge menggunakan **Squash and Merge** untuk menjaga history `develop` tetap bersih.

---

## 5. Release ke Production

1. Buat PR dari `develop` ke `main` setelah semua fitur dalam sprint selesai diuji.
2. Tambahkan tag versi semantik: `git tag -a v1.0.0 -m "Release v1.0.0"`.
3. Update `Version_History.md` di folder `08_Maintenance/`.
