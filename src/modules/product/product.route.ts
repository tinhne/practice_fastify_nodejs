import { FastifyInstance } from "fastify";
import { createProductHandler, getProductHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function productRoutes(server: FastifyInstance) {
  server.get("/", getProductHandler);
  server.post(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        body: $ref("createProductSchema"),

        response: {
          201: $ref("productResponseSchema"),
        },
      },
    },
    createProductHandler
  );
}

export default productRoutes;
