import { withCount, withList } from "@use-pico/client";
import { CategoryQuerySchema } from "~/app/category/db/CategoryQuerySchema";
import { CategorySchema } from "~/app/category/db/CategorySchema";
import {
	withCategoryQueryBuilder,
	withCategoryQueryBuilderWithSort,
} from "~/app/category/query/withCategoryQueryBuilder";
import { kysely } from "~/app/database/kysely";
import { publicProcedure, router } from "~/app/trpc/server/trpc";

export const categoryRouter = router({
	count: publicProcedure
		.input(CategoryQuerySchema)
		.query(async ({ input }) => {
			return withCount({
				select: kysely.selectFrom("Category").selectAll(),
				filter: input.filter,
				where: input.where,
				query({ select, where }) {
					return withCategoryQueryBuilder({
						select,
						where,
					});
				},
			});
		}),

	list: publicProcedure
		.input(CategoryQuerySchema)
		.query(async ({ input }) => {
			return withList({
				select: kysely.selectFrom("Category").selectAll(),
				output: CategorySchema,
				cursor: input.cursor,
				filter: input.filter,
				where: input.where,
				query({ select, where }) {
					return withCategoryQueryBuilderWithSort({
						select,
						where,
						sort: input.sort,
					});
				},
			});
		}),
});
