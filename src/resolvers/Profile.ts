import { Context } from "..";

interface ProfileParentType {
  id: number;
  bio: string;
  userId: number;
}

export const Profile = {
  user: async (parent: ProfileParentType, __: any, context: Context) => {
    const { prisma } = context;
    const { userId } = parent;

    return prisma.user.findUnique({ where: { id: userId } });
  },
};
