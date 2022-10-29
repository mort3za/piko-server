// import { getTwitterClient } from "../functions/authentication";
import { User } from "twitter-api-client/dist/interfaces/types/ListsListTypes";
import { Client } from "twitter-api-sdk";
import { getAuthClient } from "../functions/authentication";
import { readToken } from "../functions/helpers";
import { cookieOptions } from "../constants/global";

const routes = async function routes(fastify, options) {
  fastify.get("/refresh-token", refreshToken);
  fastify.get("/timelines/latest-statuses", latestStatuses);
  // fastify.get("/timelines/profile-statuses", profileStatuses);
  // fastify.get("/timelines/list-statuses", listStatuses);
  // fastify.get("/timelines/search-statuses", searchStatuses);
};

async function refreshToken(request, reply) {
  try {
    const { token } = readToken(request);

    const authClient = getAuthClient(token);
    await authClient.refreshAccessToken();

    reply.setCookie("token", JSON.stringify(authClient.token), cookieOptions).send({ code: 200 });
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

async function latestStatuses(request, reply) {
  console.log("-------------------------------------------------------");

  try {
    const { token } = readToken(request);

    console.log("token", typeof token, token);

    const authClient = getAuthClient(token);
    const client = new Client(authClient);
    // console.log("client", client);

    // const tweet = await client.tweets.findTweetsById({
    //   ids: ["1544436283019337730"],
    //   "tweet.fields": ["author_id"],
    // });

    const user = (
      await client.users.findMyUser({
        "user.fields": [
          "created_at",
          "description",
          "entities",
          "id",
          "location",
          "name",
          "pinned_tweet_id",
          "profile_image_url",
          "protected",
          // "public_metrics",
          "url",
          "username",
          "verified",
          "withheld",
        ],
      })
    ).data;
    const userId = String(user?.id);

    const params = _getOptionsV2(request);
    // fields: https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets#tab2
    const tweets = await client.tweets.usersIdTimeline(userId, {
      expansions: ["referenced_tweets.id"],
      // ...params,
      max_results: 10,
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
      "tweet.fields": [
        "attachments",
        "author_id",
        "context_annotations",
        "conversation_id",
        "created_at",
        "entities",
        "geo",
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
    });
    console.log("tweets", tweets);

    reply.send({ data: tweets });
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

// async function profileStatuses(request, reply) {
//   try {
//     const {token} = readToken(request);
//     const twitterClient = getTwitterClient({token});

//     const options = _getOptions(request);
//     const data = await twitterClient.tweets.statusesUserTimeline(options);

//     reply.send(data);
//   } catch (error) {
//     console.log(error);
//     reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
//   }
// }

// async function listStatuses(request, reply) {
//   try {
//     const {token} = readToken(request);
//     const twitterClient = getTwitterClient({token});

//     const options = _getOptions(request);
//     const data = await twitterClient.accountsAndUsers.listsStatuses(options);

//     reply.send(data);
//   } catch (error) {
//     console.log(error);
//     reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
//   }
// }

// async function searchStatuses(request, reply) {
//   try {
//     const {token} = readToken(request);
//     const twitterClient = getTwitterClient({token});

//     const options = _getOptionsV2(request);
//     const data = await twitterClient.tweetsV2.searchRecentTweets(options);

//     reply.send(data);
//   } catch (error) {
//     console.log(error);
//     reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
//   }
// }

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
