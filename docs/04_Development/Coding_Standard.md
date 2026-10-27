# Coding Standard
## Proyek: GSI One Mobile Application
## Berlaku untuk: React Native + TypeScript

---

## 1. Penamaan (Naming Convention)

| Elemen               | Konvensi        | Contoh                        |
| -------------------- | --------------- | ----------------------------- |
| Komponen React       | PascalCase      | `BookSurvey`, `BottomNav`     |
| File komponen        | PascalCase.tsx  | `HomeSkeleton.tsx`            |
| Fungsi / variabel    | camelCase       | `handleSubmit`, `isLoading`   |
| Konstanta global     | SCREAMING_SNAKE | `SUPABASE_URL`, `USER_KEY`    |
| Interface TypeScript | PascalCase (+ I opsional) | `AuthUser`, `LoginResult` |
| Tipe TypeScript      | PascalCase      | `RootStackParamList`          |
| File store/service   | camelCase.ts    | `authStore.ts`, `authService.ts` |

---

## 2. Struktur File Komponen

Setiap file komponen React Native wajib mengikuti urutan:

```tsx
// 1. Import library eksternal
import React from 'react';
import { View, Text } from 'react-native';

// 2. Import aset internal
import { colors } from '../../../assets/styles/Colors';

// 3. Import komponen internal
import Header from '../Home/header';

// 4. Definisi tipe / interface lokal (jika ada)
interface Props { ... }

// 5. Deklarasi komponen (function declaration)
function NamaKomponen(): React.ReactElement { ... }

// 6. StyleSheet (di luar fungsi komponen)
const styles = StyleSheet.create({ ... });

// 7. Export default
export default NamaKomponen;
```

---

## 3. Aturan Penulisan Kode

- Gunakan **TypeScript strict mode** (`strict: true` di `tsconfig.json`).
- Hindari penggunaan tipe `any`. Gunakan tipe eksplisit atau `unknown`.
- Semua string teks UI dalam Bahasa Indonesia kecuali identifier teknis.
- Satu file hanya boleh mengekspor satu komponen utama (default export).
- Gunakan `const` untuk variabel yang tidak berubah, `let` jika perlu reassign.
- Tidak boleh ada `console.log` di kode production (gunakan lint rule `no-console`).
- Gunakan `react-native-vector-icons` (misal Feather) untuk kebutuhan ikon UI, dan hindari penggunaan karakter unicode atau emoji teks biasa demi keselarasan visual lintas platform.

---

## 4. Aturan Formatting

Konfigurasi Prettier yang berlaku (lihat `.prettierrc.js`):
```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 4,
  "trailingComma": "es5"
}
```

Pastikan editor VSCode menggunakan **Format On Save** dengan Prettier sebagai default formatter.

---

## 5. Aturan ESLint

Konfigurasi ESLint (lihat `.eslintrc.js`) menggunakan `@react-native/eslint-config`. Rule tambahan yang aktif:
- `no-unused-vars`: error
- `react-hooks/exhaustive-deps`: warn
- `no-console`: warn

---

## 6. Aturan Penggunaan Design System

Aturan berikut memastikan konsistensi visual dan kemudahan maintainability:

### 6.1 Token Warna

**JANGAN** melakukan hardcode nilai warna di file screen atau komponen individual. Semua warna harus berasal dari `src/theme/colors.ts`:

```typescript
// BENAR
import { roleColors, neutral, surface, overlay, colors } from '../../../assets/styles/Colors';
backgroundColor: surface.screen

// SALAH
backgroundColor: '#F8F9FA'
```

### 6.2 Global Style Utility (`Gs`)

Gunakan `Gs` dari `src/theme/globalStyles.ts` untuk styling yang bersifat utilitas:

```typescript
import { Gs } from '../../../assets/styles/GlobalStyle';
// Contoh penggunaan compose:
<Text style={[Gs.h2, styles.sectionTitle]}>Judul Seksi</Text>
<View style={[Gs.flexRow, Gs.itemsCenter, styles.card]}>...</View>
```

### 6.3 Corner Radius Asimetris

Gunakan class `Gs.cornerXS` hingga `Gs.cornerXL` (bukan `borderRadius` biasa) untuk mempertahankan identitas visual asimetris (tiga sudut) GSI One.

### 6.4 Responsive Scaling

Gunakan fungsi dari `src/utils/responsive.ts` — **jangan** gunakan nilai piksel absolut:

```typescript
import { scale, fontScale, wp, hp } from '../../utils/responsive';
// Padding & margin:  scale(16)
// Font size:         fontScale(14)
// Lebar persentase:  wp(50) // 50% lebar layar
```

### 6.5 Role Theme

Gunakan `useRoleTheme()` di komponen untuk mendapatkan warna gradient dan aksen, alih-alih melakukan pengecekan `user?.role` manual:

```typescript
// BENAR
import { useRoleTheme } from '../../theme/roleTheme';
const { gradient, accent, isAdmin } = useRoleTheme();

// SALAH
const isMarketing = user?.role === 'marketing';
const headerColor = isMarketing ? '#0F9F67' : '#4A90A4';
```

Untuk konteks di luar React (navigasi, helper), gunakan `getRoleTheme(role)` dari modul yang sama.

---

## 7. Tabel Struktur Direktori Proyek

| Direktori / File | Fungsi | Bahasa |
| --- | --- | --- |
| `src/screens/` | Layar-layar UI utama per fitur (Login, Dashboard, Projects, BookSurvey) | TypeScript / TSX |
| `src/components/` | Komponen UI reusable (BottomNav, ScreenHeader, Modal) | TypeScript / TSX |
| `src/hooks/` | Custom hooks (useRoleTheme, useProjectDetail, useSurveyRequests) | TypeScript |
| `src/store/` | Zustand state management (authStore, projectStore) | TypeScript |
| `src/services/` | Service facade (authService, projectService, surveyService, notificationService, storageService) | TypeScript |
| `src/infrastructure/supabase/` | Repository pattern (IProjectRepository, SupabaseProjectRepository, SupabaseSurveyRepository) | TypeScript |
| `src/infrastructure/supabase/projects/` | Sub-repository facade (ProjectQueryRepository, ProjectStageRepository, ProjectFileRepository, ProjectCommandRepository) | TypeScript |
| `src/services/mappers/` | DTO mapper (projectMapper) | TypeScript |
| `src/types/` | Definisi tipe data global & database types | TypeScript |
| `src/utils/` | Utility functions (errorHelpers, formatters, statusMapper, responsive, logger) | TypeScript |
| `src/config/` | Konfigurasi Supabase dan adapter platform | TypeScript |
| `src/domain/` | Domain entities (ProjectEntity) | TypeScript |
| `src/theme/` | Design tokens & role theme | TypeScript |
| `__tests__/` | Test suites Jest | TypeScript |
| `docs/` | Dokumentasi SDLC (12 folder + HTML Viewer) | Markdown |

---
