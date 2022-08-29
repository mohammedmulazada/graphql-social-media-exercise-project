import { Context } from "..";

export const Query = {
  posts: (_: any, __: any, context: Context) => {
    const { prisma } = context;

    return prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
