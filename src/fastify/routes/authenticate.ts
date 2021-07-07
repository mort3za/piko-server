import { cookieOptions } from "../constants/global";
import { getTwitterClient } from "../functions/authentication";

const { OAUTH_CALLBACK_URL, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } = process.env;

const routes = async function routes(fastify, options) {
  fastify.get("/authenticate", authenticate);
};

async function authenticate(request, reply) {
  try {
    const twitterClient = getTwitterClient({
      accessToken: TWITTER_ACCESS_TOKEN,
      accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
    });
    const { oauth_token, oauth_token_secret } = await twitterClient.basics.oauthRequestToken({
      oauth_callback: OAUTH_CALLBACK_URL,
    });

    reply
      .setCookie("oauthToken", oauth_token, cookieOptions)
      .setCookie("oauthTokenSecret", oauth_token_secret, cookieOptions)
      .code(302)
      .redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

export default routes;
