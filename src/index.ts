import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { Query, Mutation, Profile, Post, User } from "./resolvers";
import { typeDefs } from "./schema";
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Profile,
    Post,
    User,
    Mutation,
  },
  context: async (contextArgs): Promise<Context> => {
    const { req } = contextArgs;
    const { headers } = req;
    const { authorization } = headers;

    const userInfo = authorization
      ? await getUserFromToken(authorization)
      : null;

    return { prisma, userInfo };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
