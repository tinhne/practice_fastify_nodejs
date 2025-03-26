import { FastifyReply, FastifyRequest } from "fastify";
import { getProducts, createProduct } from "./product.service";
import { CreateProductInput } from "./product.schema";

export async function getProductHandler() {
  return getProducts();
}

export async function createProductHandler(
  request: FastifyRequest<{ Body: CreateProductInput }>,
  reply: FastifyReply
) {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id,
  });

  return product;
}
