import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: async (parent: PostParentType, __: any, context: Context) => {
    const { authorId } = parent;

    return userLoader.load(authorId);
  },
};
