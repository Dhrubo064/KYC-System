import { Logger, LogLevel } from '../../utils/logger';
import fs from 'fs';
import path from 'path';

describe('Logger Service', () => {
  let logger: Logger;
  const testLogDir = 'logs/test-logger';

  beforeEach(() => {
    // Create a fresh logger instance for each test
    logger = new Logger(testLogDir, true, true);

    // Clean up any existing test logs
    if (fs.existsSync(testLogDir)) {
      const files = fs.readdirSync(testLogDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(testLogDir, file));
      });
    }
  });

  afterAll(() => {
    // Clean up test logs
    if (fs.existsSync(testLogDir)) {
      const files = fs.readdirSync(testLogDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(testLogDir, file));
      });
      fs.rmdirSync(testLogDir);
    }
  });

  describe('Logger initialization', () => {
    it('should create a logger instance', () => {
      expect(logger).toBeDefined();
      expect(logger).toHaveProperty('debug');
      expect(logger).toHaveProperty('info');
      expect(logger).toHaveProperty('warn');
      expect(logger).toHaveProperty('error');
    });

    it('should create logs directory if it does not exist', () => {
      expect(fs.existsSync(testLogDir)).toBe(true);
    });

    it('should have correct log file name format', () => {
      const logFile = logger.getLogFile();
      expect(logFile).toMatch(/app-\d{4}-\d{2}-\d{2}\.log$/);
    });
  });

  describe('Logging methods', () => {
    it('should log debug messages to file', () => {
      logger.debug('Debug message', { userId: 1 });
      const logs = logger.getRecentLogs();
      expect(logs).toContain('DEBUG');
      expect(logs).toContain('Debug message');
    });

    it('should log info messages to file', () => {
      logger.info('Info message', { action: 'login' });
      const logs = logger.getRecentLogs();
      expect(logs).toContain('INFO');
      expect(logs).toContain('Info message');
    });

    it('should log warning messages to file', () => {
      logger.warn('Warning message', { severity: 'medium' });
      const logs = logger.getRecentLogs();
      expect(logs).toContain('WARN');
      expect(logs).toContain('Warning message');
    });

    it('should log error messages to file', () => {
      logger.error('Error message', { code: 'ERR_001' });
      const logs = logger.getRecentLogs();
      expect(logs).toContain('ERROR');
      expect(logs).toContain('Error message');
    });

    it('should include timestamps in logs', () => {
      logger.info('Timestamped message');
      const logs = logger.getRecentLogs();
      expect(logs).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    it('should include metadata in logs', () => {
      const meta = { userId: 123, action: 'create' };
      logger.info('Message with metadata', meta);
      const logs = logger.getRecentLogs();
      expect(logs).toContain('userId');
      expect(logs).toContain('123');
    });
  });

  describe('Logger utilities', () => {
    it('should return recent logs', () => {
      logger.info('Log entry 1');
      logger.info('Log entry 2');
      logger.info('Log entry 3');

      const logs = logger.getRecentLogs(2);
      const logLines = logs.split('\n').filter((line) => line.trim());

      expect(logLines.length).toBeLessThanOrEqual(2);
      expect(logs).toContain('Log entry');
    });

    it('should return log directory', () => {
      expect(logger.getLogDir()).toBe(testLogDir);
    });

    it('should return log file path', () => {
      const logFile = logger.getLogFile();
      // Normalize path separators for cross-platform compatibility
      const normalizedLogFile = logFile.replace(/\\/g, '/');
      const normalizedTestDir = testLogDir.replace(/\\/g, '/');
      expect(normalizedLogFile).toContain(normalizedTestDir);
    });

    it('should handle reading logs from empty log file', () => {
      const logs = logger.getRecentLogs();
      expect(typeof logs).toBe('string');
    });
  });

  describe('Logger without file output', () => {
    it('should create logger without file output', () => {
      const consoleOnlyLogger = new Logger(testLogDir, true, false);
      expect(consoleOnlyLogger).toBeDefined();

      // Should not create a file
      consoleOnlyLogger.info('This should not be written to file');
    });

    it('should create logger without console output', () => {
      const fileOnlyLogger = new Logger(testLogDir, false, true);
      expect(fileOnlyLogger).toBeDefined();
      fileOnlyLogger.info('Logged silently');

      const logs = fileOnlyLogger.getRecentLogs();
      expect(logs).toContain('Logged silently');
    });
  });

  describe('Log file operations', () => {
    it('should append logs to the same file', () => {
      logger.info('First entry');
      logger.info('Second entry');

      const logFile = logger.getLogFile();
      const content = fs.readFileSync(logFile, 'utf-8');
      const lines = content.split('\n').filter((line) => line.trim());

      expect(lines.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle special characters in logs', () => {
      const specialMessage = 'Error: "Test" with special chars: @#$%^&*()';
      logger.error(specialMessage);

      const logs = logger.getRecentLogs();
      expect(logs).toContain('special chars');
    });
  });
});
