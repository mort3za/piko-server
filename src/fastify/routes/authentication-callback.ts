import { cookieOptions } from "../constants/global";
import { getAuthClient } from "../functions/authentication";
import { getSignedCookie } from "../functions/helpers";

const { FRONTEND_BASE_ORIGIN } = process.env;

const routes = async function routes(fastify, options) {
  fastify.get("/authentication-callback", authenticationCallback);
};

async function authenticationCallback(request, reply) {
  try {
    const { code: oauthReturnCode, state: oauthReturnState } = request.query;

    if (!oauthReturnCode || !oauthReturnState) {
      throw new Error("Invalid OAuth 2.0 callback parameters.");
    }

    const authClient = getAuthClient();
    await authClient.requestAccessToken(oauthReturnCode as string);

    // -------------------------------------------------
    const redirectUrl = `${FRONTEND_BASE_ORIGIN}/home`;
    reply
      .setCookie("token", JSON.stringify(authClient.token), cookieOptions)
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
