import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withCategoryQueryBuilder } from "../db/withCategoryQueryBuilder";
import { withCategorySelect } from "../db/withCategorySelect";
import type { CategoryCountQuerySchema } from "../schema/CategoryCountQuerySchema";

export namespace categoryCountFx {
	export type Props = CategoryCountQuerySchema.Type;
}

export const categoryCountFx = (query: categoryCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const { filter, where } = query;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withCategorySelect({
					database,
				}),
				filter,
				where,
				query: withCategoryQueryBuilder,
			});
		});
	});
};

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
