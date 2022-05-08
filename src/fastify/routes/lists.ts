import { getTwitterClient } from "../functions/authentication";
import { readAccessTokens } from "../functions/helpers";

const routes = async function routes(fastify, options) {
  fastify.get("/lists/list", listsList);
};

async function listsList(request, reply) {
  try {
    const { accessToken, accessTokenSecret } = readAccessTokens(request);
    const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

    const options = _getOptions(request);
    const data = await twitterClient.accountsAndUsers.listsList(options);

    reply.send(data);
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

function _getOptions(request) {
  const MAX_COUNT = 100;

  const options = {
    ...request.query,
  };
  return options;
}

export default routes;
