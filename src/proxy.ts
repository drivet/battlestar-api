import express, { NextFunction, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import jwt from 'express-jwt';
import { RequestOptions } from 'node:http';

import { getAuthTokenPublicKey, getTablesApiBase, getTablesApiKey } from './config';
import { Profile } from './tokens/token-models';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      profile?: Profile;
    }

    interface Request {
      user?: User;
    }
  }
}

function proxyOptions(apiKey: string, path_prefix: string): proxy.ProxyOptions {
  return {
    proxyReqOptDecorator: (proxyReqOpts: RequestOptions, _srcReq: Request) => {
      if (!proxyReqOpts.headers) {
        throw new Error('Missing header object in outgoing request object');
      }
      proxyReqOpts.headers['x-api-key'] = apiKey;
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

proxyRouter.use(
  jwt({ secret: getAuthTokenPublicKey(), algorithms: ['RS256'] }),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.profile) {
      return res.sendStatus(401);
    }
    next();
  }
);

proxyRouter.use('/tables', proxy(getTablesApiBase(), proxyOptions(getTablesApiKey(), '/tables')));
