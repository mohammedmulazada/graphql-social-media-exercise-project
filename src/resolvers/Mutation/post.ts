import { Post, Prisma } from "@prisma/client";
import { Context } from "../..";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    args: PostArgs,
    context: Context
  ): Promise<PostPayloadType> => {
    const { prisma, userInfo } = context;

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Unauthorized to create a post.",
          },
        ],
        post: null,
      };
    }

    const { post } = args;
    const { title, content } = post;

    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and a content to create a post.",
          },
        ],
        post: null,
      };
    }

    const newPost = await prisma.post.create({
      data: { title, content, authorId: userInfo.userId },
    });

    return { userErrors: [], post: newPost };
  },
  postUpdate: async (
    _: any,
    args: { post: PostArgs["post"]; postId: string },
    context: Context
  ): Promise<PostPayloadType> => {
    const { prisma, userInfo } = context;
    const { post, postId } = args;

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Unauthorized to create a post.",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      prisma,
      postId: Number(postId),
    });

    if (error) {
      return error;
    }

    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "Need to have atleast one field",
          },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.update({
        data: { title, content },
        where: {
          id: Number(postId),
        },
      }),
    };
  },
  postDelete: async (_: any, args: { postId: string }, context: Context) => {
    const { prisma, userInfo } = context;
    const { postId } = args;

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Unauthorized to create a post.",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      prisma,
      postId: Number(postId),
    });

    if (error) {
      return error;
    }

    if (!postId) {
      return {
        userErrors: [{ message: "You have to provide a post ID." }],
        post: [],
      };
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    if (!deletedPost) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: [],
      };
    }

    return { userErrors: [], post: deletedPost };
  },
};
