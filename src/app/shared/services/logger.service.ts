import { Injectable } from '@angular/core';
import { LogLevel } from '../models/logger.model';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  logLevel: LogLevel = new LogLevel();

  info(msg: string, data?: any): void {
    this.logWith(this.logLevel.Info, msg, data);
  }

  warn(msg: string): void {
    this.logWith(this.logLevel.Warn, msg);
  }

  error(msg: string, data?: any): void {
    this.logWith(this.logLevel.Error, msg, data);
  }

  private logWith(level: number, msg: string, logData?: any): void {
    if (level <= this.logLevel.Error) {
      switch (level) {
        case this.logLevel.None:
          return console.log(msg);
        case this.logLevel.Info:
          // tslint:disable-next-line:no-console
          return console.info('%c' + msg, 'color: #6495ED', logData);
        case this.logLevel.Warn:
          return console.warn('%c' + msg, 'color: #FF8C00');
        case this.logLevel.Error:
          return console.error('%c' + msg, 'color: #DC143C', logData);
        default:
          // tslint:disable-next-line:no-console
          console.debug(msg);
      }
    }
  }
}
