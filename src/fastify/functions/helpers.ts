export function getSignedCookie(request, cookieName) {
  const rawCookie = request.cookies[cookieName];
  if (!rawCookie) {
    throw new Error(`${cookieName} cookie not provided.`);
  }
  const signedCookie = request.unsignCookie(rawCookie);
  if (!signedCookie.valid) {
    throw new Error(`Invalid signed cookie: ${cookieName}.`);
  }
  return signedCookie.value;
}

export function readAccessTokens(request): { accessToken: string; accessTokenSecret: string } {
  if (!request.cookies.accessToken || !request.cookies.accessTokenSecret) {
    throw responseError({ statusCode: 401, message: "You are not logged in." });
  }
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
