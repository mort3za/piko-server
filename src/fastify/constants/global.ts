const oneMonth = 30 * 24 * 60 * 60 * 1000;
export const cookieOptions = {
  sameSite: "none",
  httpOnly: true,
  path: "/",
  signed: true,
  secure: true,
  expires: new Date(Date.now() + oneMonth),
};

export const expiredCookieOptions = {
  ...cookieOptions,
  expires: new Date(0),
};
