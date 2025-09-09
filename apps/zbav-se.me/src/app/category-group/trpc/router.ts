import { withCount, withList } from "@use-pico/client";
import { CategoryGroupQuerySchema } from "~/app/category-group/db/CategoryGroupQuerySchema";
import { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import {
	withCategoryGroupQueryBuilder,
	withCategoryGroupQueryBuilderWithSort,
} from "~/app/category-group/query/withCategoryGroupQueryBuilder";
import { kysely } from "~/app/database/kysely";
import { publicProcedure, router } from "~/app/trpc/server/trpc";

export const categoryGroupRouter = router({
	count: publicProcedure
		.input(CategoryGroupQuerySchema)
		.query(async ({ input }) => {
			return withCount({
				select: kysely.selectFrom("CategoryGroup").selectAll(),
				filter: input.filter,
				where: input.where,
				query({ select, where }) {
					return withCategoryGroupQueryBuilder({
						select,
						where,
					});
				},
			});
		}),

	list: publicProcedure
		.input(CategoryGroupQuerySchema)
		.query(async ({ input }) => {
			return withList({
				select: kysely.selectFrom("CategoryGroup").selectAll(),
				output: CategoryGroupSchema,
				cursor: input.cursor,
				filter: input.filter,
				where: input.where,
				query({ select, where }) {
					return withCategoryGroupQueryBuilderWithSort({
						select,
						where,
						sort: input.sort,
					});
				},
			});
		}),
});
