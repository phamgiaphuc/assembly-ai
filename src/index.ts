import express from 'express';
import cors from 'cors';
import { APIS, SERVER_PORT } from '@/configs/environment.config';
import { corsOptions } from '@/configs/cors.config';
import { logger } from '@/configs/logger.config';
import { loggerMiddleware } from '@/middlewares/logger.middleware';
import { apis_v1 } from '@/routes/v1';

const server = express();

server.use(express.json());
server.use(cors(corsOptions));
server.use(loggerMiddleware);
server.use(APIS, apis_v1);

const startTheServer = () => {
  server.listen(SERVER_PORT, () => {
    logger.info(`Server is listening on http://localhost:${SERVER_PORT}${APIS}`);
  });
};

startTheServer();
