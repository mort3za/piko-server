import { getTwitterClient } from "../functions/authentication";
import { readAccessTokens } from "../functions/helpers";

const routes = async function routes(fastify, options) {
  fastify.post("/statuses", statusPost);
  fastify.get("/statuses/:id", statusGet);

  async function statusPost(request, reply) {
    try {
      const { accessToken, accessTokenSecret } = readAccessTokens(request);
      const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

      const { status } = request.body;
      const { id, lang } = await twitterClient.tweets.statusesUpdate(status);

      reply.send({ id, lang });
    } catch (error) {
      console.log(error);
      reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
    }
  }

  async function statusGet(request, reply) {
    try {
      const { accessToken, accessTokenSecret } = readAccessTokens(request);
      const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

      const { id } = request.params;
      const status = await twitterClient.tweets.statusesShow({ id, tweet_mode: "extended" });

      reply.send(status);
    } catch (error) {
      console.log(error);
      reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
    }
  }
};

export default routes;
