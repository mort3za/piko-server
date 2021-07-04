// fixme: remove
// http://localhost:6060/api/v1/authentication-callback?oauth_token=xxxxxx&oauth_verifier=xxxxxx

import { cookieOptions } from "../constants/global";
import { fetchAccessTokens } from "../functions/authentication";
import { getSignedCookie } from "../functions/helpers";

const { FRONTEND_BASE_URL } = process.env;

const routes = async function routes(fastify, options) {
  fastify.get("/authentication-callback", authenticationCallback);
};

async function authenticationCallback(request, reply) {
  try {
    const oauthTokenSecret = getSignedCookie(request, "oauthTokenSecret");
    const oauthToken = getSignedCookie(request, "oauthToken");
    const { oauth_verifier: oauthVerifier } = request.query;
    const { accessToken, accessTokenSecret } = await fetchAccessTokens({
      oauthToken,
      oauthTokenSecret,
      oauthVerifier,
    });

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
