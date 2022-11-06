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

export function readToken(request, silent = false): { token: any } {
  if (!request.cookies.token) {
    if (silent) return { token: "" };
    throw responseError({ statusCode: 401, message: "You are not logged in." });
  }
  const token = getSignedCookie(request, "token");
  if (!token) {
    throw responseError({ statusCode: 401, message: "You are not logged in." });
  }
  return { token: JSON.parse(token) };
}

export function responseError({ statusCode = 400, message = "", messages = [] }) {
  return { error: true, statusCode, message, messages };
}

export async function getUserId(client) {
  const { data } = await client.users.findMyUser({
    "user.fields": ["id"],
    // "created_at",
    // "description",
    // "entities",
    // "location",
    // "name",
    // "pinned_tweet_id",
    // "profile_image_url",
    // "protected",
    // "public_metrics",
    // "url",
    // "username",
    // "verified",
    // "withheld",
  });
  return String(data?.id);
}
