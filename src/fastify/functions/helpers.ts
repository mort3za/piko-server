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

export function readToken(request): { token: any } {
  if (!request.cookies.token) {
    throw responseError({ statusCode: 401, message: "You are not logged in." });
  }
  const token = getSignedCookie(request, "token");
  if (!token) {
    throw responseError({ statusCode: 401, message: "You are not logged in." });
  }
  return { token };
}

export function responseError({ statusCode = 400, message = "", messages = [] }) {
  return { error: true, statusCode, message, messages };
}
