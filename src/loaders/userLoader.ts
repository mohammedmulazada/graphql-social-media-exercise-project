import { prisma } from "..";
import { User } from "@prisma/client";
import DataLoader from "dataloader";

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (ids) => {
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });

  const userMap: { [key: string]: User } = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => userMap[id]);
};

// alternative, not sure if it's better necessarily.
// type BatchUser = (ids: number[]) => Promise<(User | undefined)[]>;

// const batchUsers: BatchUser = async (ids: number[]) => {
//   const users = await prisma.user.findMany({ where: { id: { in: ids } } });

//   return ids.map((id) => users.find((user) => user.id === id));
// };

// @ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);
