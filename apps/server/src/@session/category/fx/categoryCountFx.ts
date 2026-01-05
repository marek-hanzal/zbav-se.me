import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withCategoryQueryBuilder } from "../db/withCategoryQueryBuilder";
import { withCategorySelect } from "../db/withCategorySelect";
import type { CategoryCountQuerySchema } from "../schema/CategoryCountQuerySchema";

export namespace categoryCountFx {
	export type Props = CategoryCountQuerySchema.Type;
}

export const categoryCountFx = Effect.fn("categoryCountFx")(function* ({
	filter,
	where,
}: categoryCountFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withCountFx({
		select: withCategorySelect({
			database,
		}),
		filter,
		where,
		query: withCategoryQueryBuilder,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
