import { AuthRole } from '../domain/models/auth';
export const ROLE_LABELS: Record<AuthRole, string> = {
  admin: 'Administrator',
  marketing: 'Marketing & Business Dev',
  engineer: 'Engineer Lapangan',
  client: 'Klien',
};
export const ROLE_ICONS: Record<AuthRole, string> = {
  admin: 'shield',
  marketing: 'briefcase',
  engineer: 'tool',
  client: 'user',
};
