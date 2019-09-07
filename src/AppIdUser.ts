export interface AppIdUser {
  exp: number;
  iat: number;
  email: string;
  name: string;
  email_verified: boolean;
  identities: AppIdIdentity[]
}

export interface AppIdIdentity {
  provider: string;
  id: string;
}
