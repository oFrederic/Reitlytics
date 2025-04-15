/**
 * Constants for currency conversions
 */
export const YEN_TO_MILLION_YEN = 1000000;        // 1,000,000 (百万円)
export const YEN_TO_HUNDRED_MILLION_YEN = 100000000;  // 100,000,000 (億円)

/**
 * Convert value from yen to million yen (百万円)
 */
export function convertYenToMillionYen(valueInYen: number): number {
  return valueInYen / YEN_TO_MILLION_YEN;
}

/**
 * Convert value from yen to hundred million yen (億円)
 */
export function convertYenToHundredMillionYen(valueInYen: number): number {
  return valueInYen / YEN_TO_HUNDRED_MILLION_YEN;
}

/**
 * Convert value from million yen (百万円) to yen
 */
export function convertMillionYenToYen(valueInMillionYen: number): number {
  return valueInMillionYen * YEN_TO_MILLION_YEN;
}

/**
 * Convert value from hundred million yen (億円) to yen
 */
export function convertHundredMillionYenToYen(valueInHundredMillionYen: number): number {
  return valueInHundredMillionYen * YEN_TO_HUNDRED_MILLION_YEN;
} 