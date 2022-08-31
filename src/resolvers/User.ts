import { Context } from "..";

interface UserParentType {
  id: number;
}

export const User = {
  posts: async (parent: UserParentType, __: any, context: Context) => {
    const { prisma, userInfo } = context;
    const { id } = parent;

    const isOwnProfile = id === userInfo?.userId;

    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          authorId: id,
        },
        orderBy: [{ createdAt: "desc" }],
      });
    }

    return prisma.post.findMany({ where: { authorId: id, published: true } });
  },
};
