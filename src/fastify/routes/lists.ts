import { getAuthClient } from "../functions/authentication";
import { getUserId } from "../functions/helpers";
import { Client } from "twitter-api-sdk";

const routes = async function routes(fastify, options) {
  fastify.get("/lists/list", listsList);
};

async function listsList(request, reply) {
  try {
    const authClient = getAuthClient(request);
    const client = new Client(authClient);

    // todo: get userId from FE to speedup
    const userId = await getUserId(client);
    const lists = await client.lists.listUserOwnedLists(userId, { max_results: 100 });

    reply.send(lists.data);
  } catch (error: any) {
    console.log(error);
    reply.code(error?.statusCode || 500).send({ message: error?.message });
  }
}

export default routes;
