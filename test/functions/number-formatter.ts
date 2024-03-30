/**
 * format decimal number by the place given
 * @param {*} number - number that you want to format (string)
 * @param {*} decimalPlace - number of decimals you want (int)
 * @returns - decimal number (number)
 */
export function formatDecimalNumber(number: string, decimalPlace: number) {
  return parseFloat(number).toFixed(decimalPlace);
}
