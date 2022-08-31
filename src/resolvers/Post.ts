import { Context } from "..";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: async (parent: PostParentType, __: any, context: Context) => {
    const { prisma } = context;
    const { authorId } = parent;

    return prisma.user.findUnique({ where: { id: authorId } });
  },
};
