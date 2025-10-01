import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSDC(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '0.00';
  return numAmount.toFixed(2);
}

export function formatUSDCWithSymbol(amount: string | number): string {
  return `$${formatUSDC(amount)}`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 20) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
