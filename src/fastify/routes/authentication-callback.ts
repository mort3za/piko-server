import { cookieOptions } from "../constants/global";
import { getTwitterClient } from "../functions/authentication";
import { getSignedCookie } from "../functions/helpers";

const { FRONTEND_BASE_ORIGIN } = process.env;

const routes = async function routes(fastify, options) {
  fastify.get("/authentication-callback", authenticationCallback);
};

async function authenticationCallback(request, reply) {
  // api/v1/authentication-callback?oauth_token=xxxxxx&oauth_verifier=xxxxxx
  try {
    const oauthTokenSecret = getSignedCookie(request, "oauthTokenSecret");
    const oauthTokenFromPrevStep = getSignedCookie(request, "oauthToken");
    const { oauth_verifier, oauth_token: oauthToken } = request.query;

    if (oauthTokenFromPrevStep !== oauthToken) {
      throw new Error("oauth_token does not match");
    }

    const twitterClient = getTwitterClient({
      accessToken: oauthToken,
      accessTokenSecret: oauthTokenSecret,
    });

    // oauth_token in response is now signed (different from oauthToken)
    const { oauth_token, oauth_token_secret } = await twitterClient.basics.oauthAccessToken({
      oauth_verifier,
      oauth_token: oauthToken,
    } as any);

    // -------------------------------------------------
    const redirectUrl = `${FRONTEND_BASE_ORIGIN}/home`;
    reply
      .setCookie("accessToken", oauth_token, cookieOptions)
      .setCookie("accessTokenSecret", oauth_token_secret, cookieOptions)
      .clearCookie("oauthToken", cookieOptions)
      .clearCookie("oauthTokenSecret", cookieOptions)
      .type("text/html")
      .send(
        `<html><head><script>window.location.replace("${redirectUrl}");</script></head><body>Redirecting to <a href="${redirectUrl}">homepage</a>...</body></html>`,
      );
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

export default routes;
