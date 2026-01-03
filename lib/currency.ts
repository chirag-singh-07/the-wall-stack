/**
 * Currency formatting utilities for Indian Rupee (₹)
 */

export const CURRENCY_SYMBOL = "₹";
export const CURRENCY_CODE = "INR";

/**
 * Format number as Indian Rupee currency
 * @param amount - Amount in rupees
 * @param showSymbol - Whether to show ₹ symbol (default: true)
 * @returns Formatted currency string (e.g., "₹1,00,000" or "100,000")
 */
export function formatINR(amount: number, showSymbol = true): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: CURRENCY_CODE,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  // Intl already adds ₹, so just return it
  return formatted;
}

/**
 * Format number as Indian Rupee with decimal places
 * @param amount - Amount in rupees
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted currency string with decimals
 */
export function formatINRWithDecimals(amount: number, decimalPlaces = 2): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(amount);
}

/**
 * Format large numbers with Indian numbering system
 * E.g., 1000000 becomes "10,00,000"
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Convert number to words in Indian system
 * @param num - Number to convert
 * @returns Words representation (e.g., "1 Lakh", "10 Crore")
 */
export function numberToIndianWords(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(1)} L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} K`;
  }
  return num.toString();
}

/**
 * Get abbreviated currency for display
 * E.g., ₹50 Lakh for 5000000
 */
export function formatINRAbbreviated(amount: number): string {
  if (amount >= 10000000) {
    return `${CURRENCY_SYMBOL}${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `${CURRENCY_SYMBOL}${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `${CURRENCY_SYMBOL}${(amount / 1000).toFixed(1)}K`;
  }
  return `${CURRENCY_SYMBOL}${amount}`;
}
