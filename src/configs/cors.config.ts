import { CorsOptions } from 'cors';
import { BUILD_MODE, DOMAINS_LIST } from './environment.config';
import { logger } from './logger.config';

export const corsOptions: CorsOptions = {
  origin(origin: string | undefined, callback: any) {
    // Development mode
    if (BUILD_MODE === 'development') {
      logger.info(`Origin ${origin || 'localhost'} is accepted by CORS Policy`);
      return callback(null, true);
    }
    // Production mode
    if (origin && DOMAINS_LIST.includes(origin) && BUILD_MODE === 'production') {
      logger.info(`Origin ${origin} is accepted by CORS Policy`);
      return callback(null, true);
    }
    logger.error(`Origin ${origin} is not allowed by CORS Policy`);
    return callback(null, false);
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
