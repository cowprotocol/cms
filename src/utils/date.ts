/**
 * Date utility functions
 */

/**
 * Calculate the number of months between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of months between the two dates
 */
export function getMonthsDifference(startDate: Date, endDate: Date): number {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  return years * 12 + months;
}
