import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";
import { Query, Mutation } from "./resolvers";
import { typeDefs } from "./schema";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
