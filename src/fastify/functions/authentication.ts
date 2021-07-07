import oauth from "oauth";
import { TwitterClient } from "twitter-api-client";

// documentation: https://developer.twitter.com/en/docs/authentication/overview

const {
  OAUTH_CALLBACK_URL,
  // same as consumer_key
  TWITTER_API_KEY,
  // same as consumer_secret
  TWITTER_API_SECRET,
} = process.env;

// Uses OAuth 1.0a
export function getConsumerKeys(version = 2) {
  switch (version) {
    case 1:
      return new oauth.OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        TWITTER_API_KEY,
        TWITTER_API_SECRET,
        "1.0A",
        OAUTH_CALLBACK_URL,
        "HMAC-SHA1",
      );
    case 2:
      return new oauth.OAuth2(
        TWITTER_API_KEY,
        TWITTER_API_SECRET,
        "https://api.twitter.com/",
        null,
        "oauth2/token",
        null,
      );
  }
}

export function fetchAccessTokens({
  oauthToken,
  oauthTokenSecret,
  oauthVerifier,
}): Promise<{ accessToken: string; accessTokenSecret: string }> {
  return new Promise((resolve, reject) => {
    getConsumerKeys(1).getOAuthAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier,
      function (error, accessToken, accessTokenSecret, results) {
        if (error) {
          reject("Could not get access token.");
        } else {
          resolve({ accessToken, accessTokenSecret });
        }
      },
    );
  });
}

export function getTwitterClient({ accessToken, accessTokenSecret }) {
  return new TwitterClient({
    apiKey: TWITTER_API_KEY as string,
    apiSecret: TWITTER_API_SECRET as string,
    accessToken,
    accessTokenSecret,
  });
}
