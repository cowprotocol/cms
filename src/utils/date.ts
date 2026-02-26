/**
 * Date utility functions
 */

/**
 * Calculate the actual number of months between two dates
 * This function considers the full date (year, month, and day) to determine
 * if a complete month has passed between the start and end dates.
 *
 * Examples:
 * - 31/01/2026 to 01/02/2026 = 0 months (only 1 day difference)
 * - 01/01/2026 to 02/01/2026 = 0 months (only 1 day difference)
 * - 01/01/2026 to 01/02/2026 = 1 month (exactly 1 month)
 * - 15/01/2026 to 20/02/2026 = 1 month (1 month and 5 days, rounded down)
 *
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of complete months between the two dates
 */
export function getMonthsDifference(startDate: Date, endDate: Date): number {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  const days = endDate.getDate() - startDate.getDate();

  let totalMonths = years * 12 + months;

  // If the end day is before the start day, we haven't completed a full month
  if (days < 0) {
    totalMonths--;
  }

  return Math.max(0, totalMonths);
}
