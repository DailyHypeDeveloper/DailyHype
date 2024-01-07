// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

/**
 *
 * This will return the capitalised words from input string
 * @param str input string which must not be null
 * @returns string
 * @example
 * capitaliseWord("hello world");
 */
export function capitaliseWord(str: string) {
  if (str) {
    if (str.length > 0) {
      let splitStr = str.toLowerCase().split(" ");

      splitStr.forEach((word, index) => {
        splitStr[index] =
          splitStr[index].charAt(0).toUpperCase() + splitStr[index].slice(1);
      });
      return splitStr.join(" ");
    }
  }
  return "";
}

/**
 *
 * This will return money format (e.g. 23.50)
 * @param value input string which must not be null
 * @returns string
 * formatMoney("20"); // 20.00
 */
export function formatMoney(value: string) {
  if (value) return parseFloat(value).toFixed(2).toString();
  else return "";
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
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
