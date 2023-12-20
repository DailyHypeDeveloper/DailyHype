/**
 *
 * This will return the capitalised words from input string
 * @param str(string)
 * @returns string
 */
export function capitaliseWord(str: string) {
  if (str.length > 0) {
    let splitStr = str.toLowerCase().split(" ");

    splitStr.forEach((word, index) => {
      splitStr[index] = splitStr[index].charAt(0).toUpperCase() + splitStr[index].slice(1);
    });
    return splitStr.join(" ");
  }
  return "";
}

/**
 *
 * This will return money format (e.g. 23.50)
 * @param value (string)
 * @returns string
 */
export function formatMoney(value: string) {
  return parseFloat(value).toFixed(2).toString();
}

/**
 *
 * This will return the formatted date (e.g. June 2, 2023)
 * @param date (string)
 * @returns string
 */
export function formatDateByMonthDayYear(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
