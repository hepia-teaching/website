import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { User } from "@prisma/client";
import { createSchema } from "@/zod/user";

const users: User[] = [];

export const userRouter = router({
  list: publicProcedure.query(() => {
    return users;
  }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input }) => {
      return users.find((user) => user.id === input.id);
    }),
  create: publicProcedure.input(createSchema).mutation(({ input }) => {
    let user = {
      id: Math.random(),
      ...input,
    };

    users.push(user);
    return user;
  }),
});
