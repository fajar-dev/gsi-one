export function getUserInitials(fullName?: string | null): string {
  if (!fullName) return '?';
  return fullName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
