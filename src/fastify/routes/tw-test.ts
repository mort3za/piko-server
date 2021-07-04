import { TwitterClient } from "twitter-api-client";
import { getSignedCookie } from "../functions/helpers";

const {
  // same as consumer_key
  TWITTER_API_KEY,
  // same as consumer_secret
  TWITTER_API_SECRET,
  // TWITTER_ACCESS_TOKEN,
  // TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

async function twTest(request, reply) {
  try {
    const oauthAccessToken = getSignedCookie(request, "oauthAccessToken");
    const oauthAccessTokenSecret = getSignedCookie(request, "oauthAccessTokenSecret");

    const twitterClient = new TwitterClient({
      apiKey: TWITTER_API_KEY as string,
      apiSecret: TWITTER_API_SECRET as string,
      accessToken: oauthAccessToken,
      accessTokenSecret: oauthAccessTokenSecret,
    });

    const data = await twitterClient.accountsAndUsers.usersSearch({ q: "mort3za" });
    console.log("data", data);
    reply.send({ data });
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

const routes = async function routes(fastify, options) {
  fastify.get("/tw-test", twTest);
};

export default routes;
