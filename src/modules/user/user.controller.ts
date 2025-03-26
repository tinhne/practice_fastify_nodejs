import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUser, findUserByEmail } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../utils/hash";
import { server } from "../../app";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (err) {
    console.log(err);
    return reply.code(500).send(err);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({ message: "Invalid email or password" });
  }
  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    hash: user.password,
    salt: user.salt,
  });
  if (correctPassword) {
    const { password, salt, ...rest } = user;
    // return {accessToken: server.jwt.sign(rest)}
    return reply.code(200).send({ accessToken: server.jwt.sign(rest) });
  } else {
    return { message: "Invalid email or password" };
  }
  // generate access token

  //respond
}

export async function getUserHandler() {
  const user = await findUser();
  return user;
}
