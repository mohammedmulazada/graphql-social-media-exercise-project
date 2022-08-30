import { Context } from "../..";

interface SignUpArgs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

export const authResolvers = {
  signup: (_: any, args: SignUpArgs, context: Context) => {
    const { prisma } = context;
    const { email, name, bio, password } = args;

    return prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  },
};
