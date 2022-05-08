import { getTwitterClient } from "../functions/authentication";
import { readAccessTokens } from "../functions/helpers";

const routes = async function routes(fastify, options) {
  fastify.get("/timelines/latest-statuses", latestStatuses);
  fastify.get("/timelines/profile-statuses", profileStatuses);
  fastify.get("/timelines/list-statuses", listStatuses);
  fastify.get("/timelines/search-statuses", searchStatuses);
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

async function listStatuses(request, reply) {
  try {
    const { accessToken, accessTokenSecret } = readAccessTokens(request);
    const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

    const options = _getOptions(request);
    const data = await twitterClient.accountsAndUsers.listsStatuses(options);

    reply.send(data);
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

async function searchStatuses(request, reply) {
  try {
    const { accessToken, accessTokenSecret } = readAccessTokens(request);
    const twitterClient = getTwitterClient({ accessToken, accessTokenSecret });

    const options = _getOptionsV2(request);
    const data = await twitterClient.tweetsV2.searchRecentTweets(options);

    reply.send(data);
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

function _getOptions(request) {
  const MAX_COUNT = 100;

  const options = {
    exclude_replies: request.query.exclude_replies === "true",
    include_entities: true,
    tweet_mode: "extended",
    ...request.query,
    count: Math.min(request.query.count || 20, MAX_COUNT),
  };
  return options;
}

function _getOptionsV2(request) {
  const MAX_COUNT = 100;

  const options = {
    ...request.query,
    max_results: Math.min(request.query.count || 20, MAX_COUNT),
  };
  return options;
}

export default routes;
