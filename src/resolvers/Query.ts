import { Context } from "..";

export const Query = {
  me: async (_: any, __: any, context: Context) => {
    const { prisma, userInfo } = context;

    if (!userInfo) {
      return null;
    }
    const { userId } = userInfo;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    return user;
  },
  profile: async (_: any, args: { userId: string }, context: Context) => {
    const { userId } = args;
    const { prisma } = context;
    return await prisma.profile.findUnique({
      where: { userId: Number(userId) },
    });
  },
  posts: (_: any, __: any, context: Context) => {
    const { prisma } = context;

    return prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
