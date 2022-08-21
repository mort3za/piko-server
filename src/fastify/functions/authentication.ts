// import { TwitterClient } from "twitter-api-client";
import { auth } from "twitter-api-sdk";

// documentation: https://developer.twitter.com/en/docs/authentication/overview

const { TWITTER_OAUTH2___CLIENT_ID, TWITTER_OAUTH2___CLIENT_SECRET, OAUTH_CALLBACK_URL } = process.env;

export function getAuthClient(token?: any, code_challenge: string = "twitter-link") {
  const authClient = new auth.OAuth2User(
    {
      client_id: TWITTER_OAUTH2___CLIENT_ID as string,
      client_secret: TWITTER_OAUTH2___CLIENT_SECRET as string,
      callback: OAUTH_CALLBACK_URL as string,
      scopes: [
        "tweet.read",
        "tweet.write",
        "tweet.moderate.write",
        "users.read",
        "follows.read",
        "follows.write",
        "offline.access",
        "space.read",
        "mute.read",
        "mute.write",
        "like.read",
        "like.write",
        "list.read",
        "list.write",
        "block.read",
        "block.write",
        "bookmark.read",
        "bookmark.write",
      ],
    },
    code_challenge,
  );
  authClient.token = token;
  return authClient;

  // const client = new Client(authClient);
  // return client;
  // return new TwitterClient({
  //   apiKey: TWITTER_API_KEY as string,
  //   apiSecret: TWITTER_API_SECRET as string,
  //   accessToken,
  //   accessTokenSecret,
  // });
}
