import { TwitterClient } from "twitter-api-client";

// documentation: https://developer.twitter.com/en/docs/authentication/overview

const {
  // same as consumer_key
  TWITTER_API_KEY,
  // same as consumer_secret
  TWITTER_API_SECRET,
} = process.env;

export function getTwitterClient({ accessToken, accessTokenSecret }) {
  return new TwitterClient({
    apiKey: TWITTER_API_KEY as string,
    apiSecret: TWITTER_API_SECRET as string,
    accessToken,
    accessTokenSecret,
  });
}
