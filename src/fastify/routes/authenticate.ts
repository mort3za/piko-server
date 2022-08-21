import { cookieOptions } from "../constants/global";
import { getAuthClient } from "../functions/authentication";
// import { getTwitterClient } from "../functions/authentication";

// const { OAUTH_CALLBACK_URL, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } = process.env;

const routes = async function routes(fastify, options) {
  fastify.get("/authenticate", authenticate);
};

async function authenticate(request, reply) {
  // ------------------------------------------------------
  try {
    const authClient = getAuthClient();

    // todo: change state
    const STATE = "my-state";

    const authUrl = authClient.generateAuthURL({
      state: STATE,
      // todo: check removing these params:
      code_challenge_method: "plain",
      code_challenge: "twitter-link",
    });

    reply.code(302).redirect(authUrl);
    // const twitterClient = getTwitterClient({
    //   accessToken: TWITTER_ACCESS_TOKEN,
    //   accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
    // });
    // const { oauth_token, oauth_token_secret } = await twitterClient.basics.oauthRequestToken({
    //   oauth_callback: OAUTH_CALLBACK_URL,
    // });
    // reply
    //   .setCookie("oauthToken", oauth_token, cookieOptions)
    //   .setCookie("oauthTokenSecret", oauth_token_secret, cookieOptions)
    //   .code(302)
    //   .redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

export default routes;
