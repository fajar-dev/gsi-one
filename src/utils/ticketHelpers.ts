export function generateClientTicketNumber(): string {
    const year = new Date().getFullYear();
    const random6Digits = Math.floor(100000 + Math.random() * 900000).toString();
    return `GSI-${year}-${random6Digits}`;
}

export function isTicketNumberFormat(identifier: string): boolean {
    if (!identifier) return false;
    const clean = identifier.trim();
    if (clean.includes('@')) return false;
    return clean.toUpperCase().startsWith('GSI-') || !clean.includes('@');
}
