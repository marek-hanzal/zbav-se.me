import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { withCategoryQueryBuilder } from "../db/withCategoryQueryBuilder";
import { withCategorySelect } from "../db/withCategorySelect";
import type { CategoryQuerySchema } from "../schema/CategoryQuerySchema";
import { CategorySchema } from "../schema/CategorySchema";

export namespace categoryFetchFx {
	export interface Props {
		query: Omit<CategoryQuerySchema.Type, "cursor">;
	}
}

export const categoryFetchFx = ({ query }: categoryFetchFx.Props) => {
	return Effect.gen(function* () {
		const data = yield* Effect.promise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withCategorySelect({
					sort,
				}),
				output: CategorySchema,
				filter,
				where,
				query: withCategoryQueryBuilder,
			});
		});

		if (!data) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "category",
					resourceId: "(query)",
					message: "Category not found",
				}),
			);
		}

		return data;
	});
};

export type categoryFetchFx = ReturnType<typeof categoryFetchFx>;
