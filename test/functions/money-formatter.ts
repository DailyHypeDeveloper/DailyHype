/**
 * convert the dollar money to cent
 * @param {*} dollar amount you want to conver to cent (number)
 * @returns converted cent (number)
 */
export function convertDollarToCent(dollar: number): number {
  return Math.floor(dollar * 100);
}