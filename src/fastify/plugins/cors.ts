import fastifyCors from "fastify-cors";

const { NODE_ENV, FRONTEND_BASE_HOSTNAME } = process.env;

export function register(fastify) {
  const options = {
    credentials: true,
    origin: (requestedUrl, cb) => {
      if (!requestedUrl) {
        // direct link openings
        cb(null, true);
        return;
      }
      if (NODE_ENV === "development" && /\/\/127.0.0.1:/.test(requestedUrl)) {
        // development mode
        cb(null, true);
        return;
      }
      if (NODE_ENV === "development" && /\/\/localhost/.test(requestedUrl)) {
        // development mode
        cb(null, true);
        return;
      }

      if (RegExp(FRONTEND_BASE_HOSTNAME as string).test(requestedUrl)) {
        cb(null, true);
        return;
      }

      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed."));
    },
  };

  fastify.register(fastifyCors, options);
}
