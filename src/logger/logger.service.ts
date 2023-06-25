import { LoggerService } from '@nestjs/common';

import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

export class Logger implements LoggerService {
  private format = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] - ${message}`;
  });

  private logger = createLogger({
    format: combine(
      timestamp({ format: new Date().toLocaleString() }),
      this.format,
    ),
    transports: [
      new transports.File({
        level: 'info',
        filename: process.env.LOG_FILE_PATH,
      }),
    ],
  });

  log(message: any, context?: string) {
    this.logger.log({
      level: 'info',
      message: `${context}: ${message}`,
    });
  }

  error(message: any, context?: string) {
    this.logger.log({
      level: 'error',
      message: `${context}: ${message}`,
    });
  }

  warn(message: any, context?: string) {
    this.logger.log({
      level: 'warn',
      message: `${context}: ${message}`,
    });
  }

  debug?(message: any, context?: string) {
    this.logger.log({
      level: 'debug',
      message: `${context}: ${message}`,
    });
  }

  verbose?(message: any, context?: string) {
    this.logger.log({
      level: 'verbose',
      message: `${context}: ${message}`,
    });
  }
}
