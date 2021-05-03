import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://battlestar-9084d.firebaseio.com',
});

export async function firebaseVerifyId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) {
      req.decodedToken = null;
    } else {
      const tokenSplit = tokenHeader.split(' ');
      req.decodedToken = await admin.auth().verifyIdToken(tokenSplit[1]);
    }
  } catch (err) {
    console.error(`Error thrown when decoded token ${JSON.stringify(err)}`);
    req.decodedToken = null;
  }
  next();
}
