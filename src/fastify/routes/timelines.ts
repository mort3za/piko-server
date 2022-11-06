// import { getTwitterClient } from "../functions/authentication";
import { Client } from "twitter-api-sdk";
import { getAuthClient } from "../functions/authentication";
import { getUserId } from "../functions/helpers";
import { RequestOptions } from "twitter-api-sdk/dist/request";

const routes = async function routes(fastify, options) {
  fastify.get("/timelines/latest-statuses", latestStatuses);
  fastify.get("/timelines/profile-statuses", profileStatuses);
  fastify.get("/timelines/list-statuses", listStatuses);
  // fastify.get("/timelines/search-statuses", searchStatuses);
};

// fields: https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets#tab2
const fields: Partial<RequestOptions["params"]> = {
  expansions: ["referenced_tweets.id", "author_id", "attachments.media_keys"],
  // ...params,
  max_results: 10,
  // pagination_token: "7140dibdnow9c7btw423x5552cqhwjkhi2qy68as4l92u",
  "media.fields": [
    "duration_ms",
    "height",
    "media_key",
    "preview_image_url",
    "type",
    "url",
    "width",
    "alt_text",
    "variants",
  ],
  "place.fields": [
    "contained_within",
    "country",
    "country_code",
    "full_name",
    "geo",
    "id",
    "name",
    "place_type",
  ],
  "poll.fields": ["duration_minutes", "end_datetime", "id", "options", "voting_status"],
  "user.fields": [
    // "created_at",
    // "description",
    // "entities",
    "id",
    // "location",
    "name",
    // "pinned_tweet_id",
    "profile_image_url",
    "protected",
    // "public_metrics",
    "url",
    "username",
    "verified",
    // "withheld",
  ],
  "tweet.fields": [
    "attachments",
    "author_id",
    // "context_annotations",
    "public_metrics",
    "conversation_id",
    "created_at",
    "entities",
    // "geo",
    "id",
    "in_reply_to_user_id",
    "lang",
    "possibly_sensitive",
    "referenced_tweets",
    "reply_settings",
    "source",
    "text",
    "withheld",
  ],
};

async function latestStatuses(request, reply) {
  try {
    const authClient = getAuthClient(request);
    const client = new Client(authClient);
    // todo: get userId from FE to speedup
    const userId = await getUserId(client);

    const options = _getOptionsV2(request);

    const tweets = await client.tweets.usersIdTimeline(userId, { ...fields, ...options });

    reply.send(tweets);
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

async function profileStatuses(request, reply) {
  try {
    const authClient = getAuthClient(request);
    const client = new Client(authClient);
    const options = _getOptionsV2(request);

    const tweets = await client.tweets.usersIdTweets(request.query.userId, { ...fields, ...options });

    reply.send(tweets);
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

async function listStatuses(request, reply) {
  try {
    const authClient = getAuthClient(request);
    const client = new Client(authClient);
    const options = _getOptionsV2(request);

    const tweets = await client.tweets.listsIdTweets(request.query.list_id, { ...fields, ...options });

    reply.send(tweets);
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

// async function searchStatuses(request, reply) {
//   try {
//     const twitterClient = getTwitterClient(request);

//     const options = _getOptionsV2(request);
//     const data = await twitterClient.tweetsV2.searchRecentTweets(options);

//     reply.send(data);
//   } catch (error) {
//     console.log(error);
//     reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
//   }
// }

function _getOptionsV2(request) {
  const MAX_COUNT = 100;

  const options = {
    ...request.query,
    max_results: Math.min(request.query.count || 20, MAX_COUNT),
    list_id: undefined,
  };
  return options;
}

export default routes;
