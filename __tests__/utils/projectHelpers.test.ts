import {
  getProjectLocation,
  getProjectDuration,
  getBridgeStats,
  getProgressSubtext,
} from '../../src/utils/projectHelpers';

describe('projectHelpers utility', () => {
  describe('getProjectLocation', () => {
    it('should return Kalimantan Timur for Kideco client', () => {
      expect(getProjectLocation('PT Kideco Jaya Agung', 'Survey Jembatan')).toBe('Kalimantan Timur');
    });

    it('should return Jawa Barat for Cikampek project', () => {
      expect(getProjectLocation('PT Jasa Marga', 'Inspeksi Cikampek')).toBe('Jawa Barat');
    });

    it('should return Jakarta Barat for Mulia Jaya client', () => {
      expect(getProjectLocation('Mulia Jaya Corp', 'Struktur')).toBe('Jakarta Barat');
    });

    it('should fallback to DKI Jakarta', () => {
      expect(getProjectLocation('PT Umun', 'Project A')).toBe('DKI Jakarta');
    });
  });

  describe('getProjectDuration', () => {
    it('should return fallback string when dates are missing', () => {
      expect(getProjectDuration(undefined, undefined)).toBe('Durasi Proyek: 6 Bulan');
    });

    it('should calculate duration in months when diff is >= 30 days', () => {
      expect(getProjectDuration('2026-01-01', '2026-07-01')).toContain('Bulan');
    });

    it('should calculate duration in days when diff is < 30 days', () => {
      expect(getProjectDuration('2026-01-01', '2026-01-15')).toContain('Hari');
    });
  });

  describe('getBridgeStats', () => {
    it('should parse asset count from project name', () => {
      const stats = getBridgeStats('Inspeksi 5 Jembatan Utama', 60);
      expect(stats.total).toBe(5);
      expect(stats.selesai).toBe(3);
      expect(stats.dalamProses).toBe(2);
    });

    it('should fallback to total=10 when no match in name', () => {
      const stats = getBridgeStats('Proyek Gedung Ruko', 50);
      expect(stats.total).toBe(10);
      expect(stats.selesai).toBe(5);
      expect(stats.dalamProses).toBe(5);
    });
  });

  describe('getProgressSubtext', () => {
    it('should format subtext for bridge/asset projects', () => {
      const subtext = getProgressSubtext('Jembatan Mahakam', { total: 10, selesai: 7 });
      expect(subtext).toBe('7 dari 10 aset telah diperiksa');
    });

    it('should format subtext for floor/lantai projects', () => {
      const subtext = getProgressSubtext('Pengujian 5 Lantai Ruko', { total: 5, selesai: 3 });
      expect(subtext).toBe('3 dari 5 lantai telah selesai diuji');
    });

    it('should format default subtext for other projects', () => {
      const subtext = getProgressSubtext('Audit Terowongan', { total: 4, selesai: 2 });
      expect(subtext).toBe('2 dari 4 bagian telah diperiksa');
    });
  });
});
