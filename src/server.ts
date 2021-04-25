import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';

import { getPort } from './config';
import { proxyRouter } from './proxy';
import { tokenRouter } from './tokens/token-routes';

export const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true,
  })
);
app.use(cors());
app.use('/tokens', tokenRouter);
app.use('/', proxyRouter);

const port = getPort();
app.listen(port, () => console.log(`Battlestar-api listening at http://localhost:${port}`));
