import validator from "validator";
import { Context } from "../..";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

interface SignUpArgs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

interface UserPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    args: SignUpArgs,
    context: Context
  ): Promise<UserPayload> => {
    const { prisma } = context;
    const { email, name, bio, password } = args;

    if (!validator.isEmail(email)) {
      return {
        userErrors: [{ message: "Email is not a valid email." }],
        token: null,
      };
    }

    if (
      !validator.isLength(password, {
        min: 5,
      })
    ) {
      return {
        userErrors: [
          { message: "Password needs to be at least 5 characters." },
        ],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [{ message: "Invalid name or bio" }],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    const token = await JWT.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SIGN as string,
      {
        expiresIn: 3600000,
      }
    );

    return {
      userErrors: [],
      token,
    };
  },
};
