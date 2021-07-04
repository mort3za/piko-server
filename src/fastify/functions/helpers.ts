export function getSignedCookie(request, cookieName) {
  const signedCookie = request.unsignCookie(request.cookies[cookieName]);
  if (!signedCookie.valid) {
    throw new Error(`Invalid signed cookie: ${cookieName}.`);
  }
  return signedCookie.value;
}

export function readAccessTokens(request): { accessToken: string; accessTokenSecret: string } {
  const accessToken = getSignedCookie(request, "accessToken");
  const accessTokenSecret = getSignedCookie(request, "accessTokenSecret");
  if (!accessToken || !accessTokenSecret) {
    throw responseError({ statusCode: 401, message: "You are not logged in." });
  }
  return { accessToken, accessTokenSecret };
}

export function responseError({ statusCode = 400, message = "", messages = [] }) {
  return { error: true, statusCode, message, messages };
}
