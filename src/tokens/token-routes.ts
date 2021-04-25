import express, { Request, Response } from 'express';

import { authenticate } from './token-utils';

export const tokenRouter = express.Router();

tokenRouter.post('/sessions', async (req: Request, res: Response) => {
  res.send(await authenticate(req.body.idtoken));
});
