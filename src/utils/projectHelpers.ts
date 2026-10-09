
export const getProjectImage = (name?: string) => {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('jembatan') || lowerName.includes('bridge')) {
    return require('../../assets/images/projects/bridge-1.jpg');
  }
  if (lowerName.includes('ruko') || lowerName.includes('gedung') || lowerName.includes('building')) {
    return require('../../assets/images/projects/building-1.jpg');
  }
  if (lowerName.includes('terowongan') || lowerName.includes('tunnel')) {
    return require('../../assets/images/projects/Tunnel-1.jpg');
  }
  return require('../../assets/images/projects/bridge-2.jpg');
};

export const getProjectLocation = (clientName?: string, name?: string): string => {
  const lowerClient = (clientName || '').toLowerCase();
  const lowerName = (name || '').toLowerCase();
  if (lowerClient.includes('kideco') || lowerName.includes('kja')) return 'Kalimantan Timur';
  if (lowerClient.includes('cikampek') || lowerName.includes('cikampek')) return 'Jawa Barat';
  if (lowerClient.includes('mulia jaya')) return 'Jakarta Barat';
  return 'DKI Jakarta';
};

export const getProjectDuration = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return 'Durasi Proyek: 6 Bulan';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths >= 1) return `Durasi Proyek: ${diffMonths} Bulan`;
  return `Durasi Proyek: ${diffDays} Hari`;
};

interface BridgeStats {
  total: number;
  selesai: number;
  dalamProses: number;
}

export const getBridgeStats = (projectName?: string, progressPercent: number = 0): BridgeStats => {
  const name = projectName || '';
  const match = name.match(/(\d+)\s+(Jembatan|Aset|Asset)/i);
  const total = match ? parseInt(match[1], 10) : 10;
  const selesai = Math.round(total * (progressPercent / 100));
  const dalamProses = total - selesai;
  return { total, selesai, dalamProses };
};

export const getProgressSubtext = (
  projectName: string,
  stats: { total: number; selesai: number }
): string => {
  const lower = projectName.toLowerCase();
  if (
    lower.includes('jembatan') ||
    lower.includes('bridge') ||
    lower.includes('aset') ||
    lower.includes('asset')
  ) {
    return `${stats.selesai} dari ${stats.total} aset telah diperiksa`;
  }
  if (lower.includes('lantai')) {
    return `${stats.selesai} dari ${stats.total} lantai telah selesai diuji`;
  }
  return `${stats.selesai} dari ${stats.total} bagian telah diperiksa`;
};
