export interface Profile {
  id: string;
  email?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  imageUrl?: string;
}

export interface SessionTokenPayload {
  profile: Profile;
  expiry: number;
}
