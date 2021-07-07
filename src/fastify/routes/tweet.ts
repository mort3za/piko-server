const routes = async function routes(fastify, options) {
  fastify.post("/tweet", tweetPost);

  async function tweetPost(request, reply) {
    try {
      reply.send({ hi: true });
    } catch (error) {
      console.log(error);
      reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
    }
  }
};

export default routes;
