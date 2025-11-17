import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withCategoryQueryBuilder } from "../db/withCategoryQueryBuilder";
import { withCategorySelect } from "../db/withCategorySelect";
import type { CategoryQuerySchema } from "../schema/CategoryQuerySchema";

export namespace categoryCountFx {
	export interface Props {
		query: Omit<CategoryQuerySchema.Type, "cursor" | "sort">;
	}
}

export const categoryCountFx = ({ query }: categoryCountFx.Props) => {
	return Effect.gen(function* () {
		const { filter, where } = query;

		return yield* Effect.promise(async () => {
			return withCount({
				select: withCategorySelect(),
				filter,
				where,
				query: withCategoryQueryBuilder,
			});
		});
	});
};

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
