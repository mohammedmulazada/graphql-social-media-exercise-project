import JWT from "jsonwebtoken";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, process.env.JWT_SIGN as string) as {
      userId: number;
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
