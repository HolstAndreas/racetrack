const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  },

  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
  },
};

const isLoggingEnabled = process.env.NODE_LOGGING !== "false";

const logger = {
  info: (message) => {
    if (isLoggingEnabled) {
      console.log(`${colors.fg.cyan}[INFO]${colors.reset} ${message}`);
    }
  },

  success: (message) => {
    if (isLoggingEnabled) {
      console.log(`${colors.fg.green}[SUCCESS]${colors.reset} ${message}`);
    }
  },

  warning: (message) => {
    if (isLoggingEnabled) {
      console.log(`${colors.fg.yellow}[WARNING]${colors.reset} ${message}`);
    }
  },

  error: (message) => {
    if (isLoggingEnabled) {
      console.log(`${colors.fg.red}[ERROR]${colors.reset} ${message}`);
    }
  },

  debug: (message) => {
    if (isLoggingEnabled) {
      console.log(`${colors.fg.magenta}[DEBUG]${colors.reset} ${message}`);
    }
  },

  custom: (category, message, fgColor = "white", bgColor = null) => {
    if (isLoggingEnabled) {
      const fg = colors.fg[fgColor] || colors.fg.white;
      const bg = bgColor ? colors.bg[bgColor] : "";
      console.log(`${fg}${bg}[${category}]${colors.reset} ${message}`);
    }
  },
};

export default logger;
