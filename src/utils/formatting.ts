/**
 * Formatting utilities
 * 
 * General-purpose formatting functions for dates, text, and data display
 * with proper Japanese localization and business context.
 */

import type { TimeFilterOption } from '@/types/charts';

/**
 * Format date for display based on Japanese business conventions
 */
export function formatDate(
  date: Date | string,
  options: {
    format?: 'short' | 'medium' | 'long' | 'iso';
    locale?: string;
    includeTime?: boolean;
  } = {}
): string {
  const { format = 'medium', locale = 'ja-JP' } = options;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '無効な日付';
  }

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });
      
    case 'medium':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      
    case 'long':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
      
    case 'iso':
      return dateObj.toISOString().split('T')[0];
      
    default:
      return dateObj.toLocaleDateString(locale);
  }
}

/**
 * Format date for chart display based on time filter
 */
export function formatDateForChart(date: Date, timeFilter: TimeFilterOption): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  switch (timeFilter) {
    case 'Month' as TimeFilterOption:
      return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
      
    case 'Quarter' as TimeFilterOption:
    case 'Halfyear' as TimeFilterOption:
      return `${year}/${month.toString().padStart(2, '0')}`;
      
    case 'Year' as TimeFilterOption:
    default:
      return `${year}`;
  }
}

/**
 * Format relative time (e.g., "2日前", "3ヶ月前")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return '今日';
  } else if (diffInDays === 1) {
    return '昨日';
  } else if (diffInDays < 7) {
    return `${diffInDays}日前`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}週間前`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months}ヶ月前`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years}年前`;
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string,
  maxLength: number,
  options: {
    ellipsis?: string;
    wordBoundary?: boolean;
  } = {}
): string {
  const { ellipsis = '...', wordBoundary = true } = options;
  
  if (text.length <= maxLength) {
    return text;
  }
  
  let truncated = text.substring(0, maxLength - ellipsis.length);
  
  if (wordBoundary) {
    // Try to break at word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.75) {
      truncated = truncated.substring(0, lastSpace);
    }
  }
  
  return truncated + ellipsis;
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Format Japanese address for display
 */
export function formatJapaneseAddress(address: string): string {
  // Remove extra whitespace and normalize
  return address.replace(/\s+/g, '').trim();
}

/**
 * Format building area (tsubo to square meters conversion)
 */
export function formatBuildingArea(
  tsuboValue: string | number,
  options: {
    unit?: 'tsubo' | 'sqm' | 'both';
    decimals?: number;
  } = {}
): string {
  const { unit = 'tsubo', decimals = 2 } = options;
  
  const numValue = typeof tsuboValue === 'string' ? parseFloat(tsuboValue) : tsuboValue;
  
  if (isNaN(numValue)) {
    return '-';
  }
  
  const sqmValue = numValue * 3.30579; // 1 tsubo = 3.30579 m²
  
  switch (unit) {
    case 'sqm':
      return `${sqmValue.toFixed(decimals)}m²`;
      
    case 'both':
      return `${numValue.toLocaleString('ja-JP')}坪 (${sqmValue.toFixed(decimals)}m²)`;
      
    case 'tsubo':
    default:
      return `${numValue.toLocaleString('ja-JP')}坪`;
  }
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(
  latitude: string | number,
  longitude: string | number,
  decimals: number = 6
): string {
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  
  if (isNaN(lat) || isNaN(lng)) {
    return '座標不明';
  }
  
  return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
}

/**
 * Format search result count
 */
export function formatResultCount(count: number, total?: number): string {
  if (total !== undefined) {
    return `${count.toLocaleString('ja-JP')} / ${total.toLocaleString('ja-JP')} 件`;
  }
  return `${count.toLocaleString('ja-JP')} 件`;
}

/**
 * Format loading text with dots animation
 */
export function formatLoadingText(baseText: string = '読み込み中', dotCount: number = 3): string {
  const dots = '.'.repeat(Math.max(0, Math.min(3, dotCount)));
  return `${baseText}${dots}`;
}

/**
 * Sanitize text for HTML display
 */
export function sanitizeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Generate initials from name
 */
export function generateInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, maxLength);
}