import { getTwitterClient } from "../functions/authentication";
import { readAccessTokens } from "../functions/helpers";

const routes = async function routes(fastify, options) {
  fastify.get("/timelines/latest-statuses", latestStatuses);
  fastify.get("/timelines/profile-statuses", profileStatuses);
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

async function profileStatuses(request, reply) {
  try {
    // todo: move to a service
    const { accessToken, accessTokenSecret } = readAccessTokens(request);
    const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

    const options = _getOptions(request);
    const data = await twitterClient.tweets.statusesUserTimeline(options);

    reply.send(data);
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

function _getOptions(request) {
  const MAX_COUNT = 100;

  const options = {
    include_entities: true,
    tweet_mode: "extended",
    ...request.query,
    count: Math.min(request.query.count || 20, MAX_COUNT),
    // for profile:
    screen_name: request.query.screen_name,
  };
  return options;
}

export default routes;
