// serverless for vercel: https://www.fastify.io/docs/latest/Serverless/#vercel
"use strict";

import fastify from "fastify";
import pino from "pino";
import fastifyCookie, { FastifyCookieOptions } from "fastify-cookie";

// routes
import hi from "../fastify/routes/hi";
import twTest from "../fastify/routes/tw-test";
import authenticate from "../fastify/routes/authenticate";
import authenticationCallback from "../fastify/routes/authentication-callback";
import timelines from "../fastify/routes/timelines";

const { API_PREFIX, LOG_LEVEL, COOKIE_SECRET } = process.env;

const log = pino({ level: LOG_LEVEL, prettyPrint: true });
function build() {
  const app = fastify({
    logger: log,
  });

  // routes
  app.register(hi, { prefix: API_PREFIX });
  app.register(twTest, { prefix: API_PREFIX });
  app.register(authenticate, { prefix: API_PREFIX });
  app.register(authenticationCallback, { prefix: API_PREFIX });
  app.register(timelines, { prefix: API_PREFIX });

  app.register(fastifyCookie, {
    // https://github.com/fastify/fastify-cookie
    secret: COOKIE_SECRET,
    parseOptions: {},
  } as FastifyCookieOptions);

  return app;
}

export default build;
