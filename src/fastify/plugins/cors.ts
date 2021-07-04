import fastifyCors from "fastify-cors";

const { NODE_PROFILE, FRONTEND_BASE_URL } = process.env;

export function register(fastify) {
  fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin) {
        // direct link openings
        cb(null, true);
        return;
      }
      if (NODE_PROFILE === "development" && /localhost/.test(origin)) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      if (RegExp(FRONTEND_BASE_URL as string).test(origin)) {
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed."));
    },
  });
}
