/**
 * Logs messages to the console with a custom style.
 * @param {string} source - The source thats being logged.
 * @param {string} data - The data or any additional info.
 */
export function logger(source, data) {
  console.log(`%c ${source} `, "background: #222; color: #bada55;", data);
}
