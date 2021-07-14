import fastifyCors from "fastify-cors";

const { NODE_ENV, FRONTEND_BASE_HOSTNAME } = process.env;

export function register(fastify) {
  const options = {
    credentials: true,
    origin: (origin, cb) => {
      if (!origin) {
        // direct link openings
        cb(null, true);
        return;
      }

      if (NODE_ENV === "development" && /localhost/.test(origin)) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }

      if (RegExp(FRONTEND_BASE_HOSTNAME as string).test(origin)) {
        cb(null, true);
        return;
      }

      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed."));
    },
  };

  fastify.register(fastifyCors, options);
}
