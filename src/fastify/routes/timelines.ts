import { getTwitterClient } from "../functions/authentication";
import { readAccessTokens } from "../functions/helpers";

const routes = async function routes(fastify, options) {
  fastify.get("/timelines/latest-statuses", latestStatuses);
};

async function latestStatuses(request, reply) {
  try {
    const { accessToken, accessTokenSecret } = readAccessTokens(request);
    const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

    const options = _getOptions(request);
    const data = await twitterClient.tweets.statusesHomeTimeline(options);

    reply.send(data);
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

function _getOptions(request) {
  const MAX_COUNT = 100;
  const options = {
    count: Math.min(request.query.count || 8, MAX_COUNT),
  };
  return options;
}

export default routes;
