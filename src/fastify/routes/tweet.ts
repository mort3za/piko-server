import { getTwitterClient } from "../functions/authentication";
import { readAccessTokens } from "../functions/helpers";

const routes = async function routes(fastify, options) {
  fastify.post("/tweet", tweetPost);

  async function tweetPost(request, reply) {
    try {
      const { accessToken, accessTokenSecret } = readAccessTokens(request);
      const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

      const { tweet } = request.body;
      const { id, lang } = await twitterClient.tweets.statusesUpdate(tweet);

      reply.send({ id, lang });
    } catch (error) {
      console.log(error);
      reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
    }
  }
};

export default routes;
