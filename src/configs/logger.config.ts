import winston, { format, transports } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { LOG_LEVEL } from './environment.config';

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta: {
    service: 'Server',
  },
  format: format.combine(
    format.metadata(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ssA',
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.align(),
        format.printf(({ timestamp, level, message, metadata }) => {
          const { service, id, ...rest } = metadata;
          return `[${timestamp}] ${uuidv4()} ${metadata.service} - ${level} : ${message} ${Object.keys(rest).length > 0 ? `,${JSON.stringify(rest)}` : ''}`;
        }),
      ),
    }),
    // new transports.File({
    //   level: 'info',
    //   dirname: 'src/logs',
    //   filename: 'server-infos.log',
    //   format: format.combine(format.json()),
    // }),
    // new transports.File({
    //   level: 'error',
    //   dirname: 'src/logs',
    //   filename: 'server-errors.log',
    //   format: format.combine(format.json()),
    // }),
  ],
});
