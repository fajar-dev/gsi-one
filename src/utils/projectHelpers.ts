export const getProjectImage = (name?: string) => {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('jembatan') || lowerName.includes('bridge')) {
    return require('../../assets/images/projects/bridge-1.jpg');
  }
  if (
    lowerName.includes('ruko') ||
    lowerName.includes('gedung') ||
    lowerName.includes('building')
  ) {
    return require('../../assets/images/projects/building-1.jpg');
  }
  if (lowerName.includes('terowongan') || lowerName.includes('tunnel')) {
    return require('../../assets/images/projects/Tunnel-1.jpg');
  }
  return require('../../assets/images/projects/bridge-2.jpg');
};

export const getProjectDuration = (
  startDate?: string,
  endDate?: string,
): string => {
  if (!startDate || !endDate) return 'Jadwal belum ditentukan';
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start)
    return 'Jadwal belum valid';
  const days = Math.ceil((end - start) / 86400000);
  return `Durasi Proyek: ${days} Hari`;
};
