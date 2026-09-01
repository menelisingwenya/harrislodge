export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateInput(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffMs = outDate.getTime() - inDate.getTime();
  const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(nights, 0);
}

export function calculateRoomTotal(pricePerNight: number, nights: number): number {
  return Math.max(pricePerNight * Math.max(nights, 1), 0);
}

export function calculateConferenceTotal(ratePerHour: number, durationHours: number): number {
  return Math.max(ratePerHour * Math.max(durationHours, 0), 0);
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  return /^[+\d][\d\s\-()]{7,}$/.test(phone.trim());
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
