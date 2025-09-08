import z from "zod";
import { publicProcedure, router } from "./trpc";

export const apiRouter = router({
	hello: publicProcedure.input(z.string()).query(({ input }) => {
		return `hello ${input}`;
	}),
});

export type ApiRouter = typeof apiRouter;
