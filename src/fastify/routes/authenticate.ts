import { cookieOptions } from "../constants/global";
import { getOauthTokens } from "../functions/authentication";

const routes = async function routes(fastify, options) {
  fastify.get("/authenticate", authenticate);
};

async function authenticate(request, reply) {
  try {
    const { oauthToken, oauthTokenSecret } = await getOauthTokens();

    const redirectUrl = "https://twitter.com/oauth/authorize?oauth_token=" + oauthToken;
    reply
      .setCookie("oauthToken", oauthToken, cookieOptions)
      .setCookie("oauthTokenSecret", oauthTokenSecret, cookieOptions)
      .code(302)
      .redirect(redirectUrl);
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

export default routes;
