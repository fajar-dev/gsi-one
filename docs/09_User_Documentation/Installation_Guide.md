# Installation Guide
## Proyek: GSI One Mobile Application

---

## Instalasi untuk Pengguna Akhir

### Android
1. Buka **Google Play Store**.
2. Ketik "GSI One" di kolom pencarian.
3. Pilih aplikasi "GSI One - Graha Survei Indonesia".
4. Tekan **Instal** dan tunggu proses unduhan selesai.
5. Setelah selesai, tekan **Buka**.

### iOS
1. Buka **App Store**.
2. Ketik "GSI One" di kolom pencarian.
3. Tekan tombol **Dapatkan**.
4. Autentikasi dengan Face ID / Touch ID atau masukkan Apple ID password.
5. Tekan **Buka** setelah instalasi selesai.

---

## Instalasi untuk Pengembang (Development)

### Prasyarat Sistem
- **OS**: Windows 10/11, macOS 12+, atau Ubuntu 20.04+
- **Node.js**: >= 20.x LTS
- **Android Studio** (untuk Android development)
- **Xcode 15+** (untuk iOS development, hanya macOS)
- **Git**: >= 2.x

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone <url-repository> "GSI One"
cd "GSI One"

# 2. Install dependensi JavaScript
npm install

# 3. (iOS only) Install CocoaPods dependencies
bundle install
cd ios && bundle exec pod install && cd ..

# 4. Verifikasi lingkungan React Native
npx react-native doctor
```

### Menjalankan Aplikasi

**Android:**
```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run di emulator / device
npm run android
```

**iOS (macOS only):**
```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run di simulator / device
npm run ios
```

---

## Persyaratan Perangkat

| Platform | Minimum Versi OS |
| -------- | ---------------- |
| Android  | Android 5.0 (API 21 / Lollipop) |
| iOS      | iOS 13.0         |
