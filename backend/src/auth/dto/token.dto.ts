export type TokenObject = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export type UserForToken = {
  sub: string;
  role: string;
};
