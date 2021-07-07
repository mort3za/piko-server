// fixme: remove
// http://localhost:6060/api/v1/authentication-callback?oauth_token=xxxxxx&oauth_verifier=xxxxxx

import { cookieOptions } from "../constants/global";
import { fetchAccessTokens, getTwitterClient } from "../functions/authentication";
import { getSignedCookie } from "../functions/helpers";

const { FRONTEND_BASE_URL, TWITTER_API_KEY, TWITTER_API_SECRET } = process.env;

const routes = async function routes(fastify, options) {
  fastify.get("/authentication-callback", authenticationCallback);
};

async function authenticationCallback(request, reply) {
  try {
    const oauthToken = getSignedCookie(request, "oauth_token");
    const oauthTokenSecret = getSignedCookie(request, "oauth_token_secret");
    const { oauth_verifier } = request.query;

    const { accessToken, accessTokenSecret } = await fetchAccessTokens({
      oauthToken,
      oauthTokenSecret,
      oauthVerifier: oauth_verifier,
    });

    // todo: use twitterClient instead (pending for issue https://github.com/FeedHive/twitter-api-client/issues/78)
    // const twitterClient = getTwitterClient({
    //   accessToken: oauthToken,
    //   accessTokenSecret: oauthTokenSecret,
    // });

    // const data = await twitterClient.basics.oauthAccessToken({
    //   oauth_verifier,
    //   // oauth_token: oauthToken,
    // } as any);

    const redirectUrl = `//${FRONTEND_BASE_URL}/home`;
    reply
      .setCookie("accessToken", accessToken, cookieOptions)
      .setCookie("accessTokenSecret", accessTokenSecret, cookieOptions)
      .clearCookie("oauthToken", cookieOptions)
      .clearCookie("oauthTokenSecret", cookieOptions)
      .type("text/html")
      .send(
        `<html><head><script>window.location.replace("${redirectUrl}")</script></head><body>Redirecting to <a href="${redirectUrl}">homepage</a>...</body></html>`,
      );
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

export default routes;
