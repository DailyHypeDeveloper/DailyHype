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
