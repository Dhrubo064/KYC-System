import fs from 'fs';
import path from 'path';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private logDir: string;
  private logFile: string;
  private consoleEnabled: boolean;
  private fileEnabled: boolean;

  constructor(
    logDir: string = 'logs',
    consoleEnabled: boolean = true,
    fileEnabled: boolean = true
  ) {
    this.logDir = logDir;
    this.consoleEnabled = consoleEnabled;
    this.fileEnabled = fileEnabled;

    // Generate log filename with date
    const date = new Date().toISOString().split('T')[0];
    this.logFile = path.join(this.logDir, `app-${date}.log`);

    // Create logs directory if it doesn't exist
    if (this.fileEnabled && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: any
  ): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  private writeToFile(formattedMessage: string): void {
    if (!this.fileEnabled) return;

    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n', 'utf-8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    const formattedMessage = this.formatMessage(level, message, meta);

    if (this.consoleEnabled) {
      const consoleMethod = this.getConsoleMethod(level);
      consoleMethod(formattedMessage);
    }

    this.writeToFile(formattedMessage);
  }

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  getLogFile(): string {
    return this.logFile;
  }

  getLogDir(): string {
    return this.logDir;
  }

  // Utility method to read recent logs
  getRecentLogs(lines: number = 100): string {
    try {
      if (!fs.existsSync(this.logFile)) {
        return 'No logs available';
      }

      const content = fs.readFileSync(this.logFile, 'utf-8');
      const logLines = content.split('\n').filter((line) => line.trim());

      return logLines.slice(-lines).join('\n');
    } catch (error) {
      return `Error reading logs: ${error}`;
    }
  }

  // Clear old log files (older than specified days)
  clearOldLogs(daysOld: number = 7): void {
    try {
      if (!fs.existsSync(this.logDir)) return;

      const now = Date.now();
      const files = fs.readdirSync(this.logDir);

      files.forEach((file) => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        const daysFileAge = fileAge / (1000 * 60 * 60 * 24);

        if (daysFileAge > daysOld) {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Error clearing old logs:', error);
    }
  }
}

// Export a singleton instance
export const logger = new Logger(
  process.env.LOG_DIR || 'logs',
  process.env.NODE_ENV !== 'test'
);
