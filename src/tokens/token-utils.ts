import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { getAuthTokenPrivateKey } from '../config';
import { Profile } from './token-models';

const CLIENT_ID = '697453209068-7tulp9hdi8udrpl8j1n792f2olqp1uln.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);

export async function authenticate(idToken: string): Promise<string> {
  const tokenPayload = await verify(idToken);
  return newSessionJwt(makeProfile(tokenPayload), '1h');
}

export function refresh(profile: Profile): string {
  return newSessionJwt(profile, '1h');
}

function makeProfile(tokenPayLoad: TokenPayload): Profile {
  return {
    id: tokenPayLoad.sub,
    email: tokenPayLoad.email,
    familyName: tokenPayLoad.family_name,
    givenName: tokenPayLoad.given_name,
    imageUrl: tokenPayLoad.picture,
    name: tokenPayLoad.name,
  };
}

async function verify(idToken: string): Promise<TokenPayload> {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Token payload does not exist');
  }
  return payload;
}

function newSessionJwt(profile: Profile, expiresIn: number | string): string {
  return jwt.sign(
    {
      profile,
    },
    getAuthTokenPrivateKey(),
    {
      expiresIn,
      algorithm: 'RS256',
    }
  );
}
