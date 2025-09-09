import { categoryRouter } from "~/app/category/trpc/router";
import { categoryGroupRouter } from "~/app/category-group/trpc/router";
import { router } from "./trpc";

export const apiRouter = router({
	category: categoryRouter,
	categoryGroup: categoryGroupRouter,
});

export type ApiRouter = typeof apiRouter;
