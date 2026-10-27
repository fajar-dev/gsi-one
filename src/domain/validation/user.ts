export function validateNewUser(
  name: string,
  email: string,
  password: string,
): string | null {
  if (!name.trim()) return 'Nama lengkap wajib diisi.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return 'Masukkan alamat email yang valid.';
  if (!password.trim() || password.length < 8)
    return 'Password minimal 8 karakter.';
  return null;
}
