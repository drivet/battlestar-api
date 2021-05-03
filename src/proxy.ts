import express, { NextFunction, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import { RequestOptions } from 'node:http';

import { getTablesApiBase, getTablesApiKey } from './config';
import { firebaseVerifyId } from './firebase-id';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      decodedToken?: any;
    }
  }
}

function proxyOptions(apiKey: string, path_prefix: string): proxy.ProxyOptions {
  return {
    proxyReqOptDecorator: (proxyReqOpts: RequestOptions, srcReq: Request) => {
      if (!proxyReqOpts.headers) {
        throw new Error('Missing header object in outgoing request object');
      }
      proxyReqOpts.headers['x-api-key'] = apiKey;
      if (srcReq.decodedToken) {
        proxyReqOpts.headers['x-uid'] = srcReq.decodedToken.uid;
      }
      delete proxyReqOpts.headers['Authorization'];
      delete proxyReqOpts.headers['authorization'];
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req: Request) => {
      return path_prefix + req.url;
    },
  };
}

export const proxyRouter = express.Router();

proxyRouter.use(firebaseVerifyId, (req: Request, res: Response, next: NextFunction) => {
  if (!req.decodedToken) {
    return res.sendStatus(401);
  }
  next();
});

proxyRouter.use('/tables', proxy(getTablesApiBase(), proxyOptions(getTablesApiKey(), '/tables')));
