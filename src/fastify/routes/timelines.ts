import { getTwitterClient } from "../functions/authentication";
import { readAccessTokens } from "../functions/helpers";

async function latestTweets(request, reply) {
  try {
    const { accessToken, accessTokenSecret } = readAccessTokens(request);

    const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

    const data = await twitterClient.tweets.statusesHomeTimeline({ count: 8 });
    console.log("data", data);
    reply.send({ data });
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

const routes = async function routes(fastify, options) {
  fastify.get("/timelines/latest-tweets", latestTweets);
};

export default routes;
