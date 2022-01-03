import { cookieOptions } from "../constants/global";

const { FRONTEND_BASE_URL } = process.env;

const routes = async function routes(fastify, options) {
  fastify.get("/logout", logout);
};

async function logout(request, reply) {
  try {
    const redirectUrl = `//${FRONTEND_BASE_URL}/home`;

    reply
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("accessTokenSecret", cookieOptions)
      .code(302)
      .type("text/html")
      .send(
        `<html><head><script>window.location.replace("${redirectUrl}");</script></head><body>Redirecting to <a href="${redirectUrl}">homepage</a>...</body></html>`,
      );
  } catch (error) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message, code: error?.code });
  }
}

export default routes;
