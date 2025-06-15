/**
 * Utility functions for consistent score color display across the application
 */

/**
 * Returns a text color class based on the score percentage
 * Green (100% to 80%), Yellow (79% to 50%), Red (below 50%)
 */
export function getScoreTextColor(percentage: number): string {
  if (percentage >= 90) return "text-emerald-800 dark:text-emerald-400";
  if (percentage >= 80) return "text-green-700 dark:text-green-400";
  if (percentage >= 70) return "text-lime-700 dark:text-lime-400";
  if (percentage >= 60) return "text-yellow-700 dark:text-yellow-400";
  if (percentage >= 50) return "text-amber-700 dark:text-amber-400";
  return "text-red-700 dark:text-red-400";
}

/**
 * Returns a background color class based on the score percentage
 * Green (100% to 80%), Yellow (79% to 50%), Red (below 50%)
 */
export function getScoreBgColor(percentage: number): string {
  if (percentage >= 90)
    return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300";
  if (percentage >= 80)
    return "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/80 dark:text-green-300";
  if (percentage >= 70)
    return "bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-950 dark:text-lime-300";
  if (percentage >= 60)
    return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300";
  if (percentage >= 50)
    return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300";
  return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300";
}

/**
 * Returns a progress bar color class based on the score percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 90) return "bg-green-600";
  if (percentage >= 80) return "bg-emerald-500";
  if (percentage >= 70) return "bg-lime-600";
  if (percentage >= 60) return "bg-yellow-600";
  if (percentage >= 50) return "bg-amber-600";
  return "bg-red-600";
}
