import { Effect } from "effect";
import { sql } from "kysely";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace categoryMissCreateFx {
	export interface Props {
		fulltext: string[] | undefined;
		limit?: number;
	}
}

export const categoryMissCreateFx = Effect.fn("categoryMissCreateFx")(function* ({
	fulltext,
	limit = 4,
}: categoryMissCreateFx.Props) {
	const logger = yield* getLoggerFx("categoryMissCreateFx");
	logger.trace("categoryMissCreateFx", {
		fulltext,
		limit,
	});

	const dateService = yield* DateServiceFx;
	const category = fulltext?.join(" ").trim();

	if (!category || category.length < limit) {
		return yield* Effect.void;
	}

	const now = dateService.now();

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("category_miss")
			.values({
				id: genId(),
				category,
				count: 1,
				updatedAt: now.toJSDate(),
			})
			.onConflict((oc) =>
				oc
					.columns([
						"category",
					])
					.doUpdateSet({
						count: sql`category_miss.count + 1`,
						updatedAt: now.toJSDate(),
					}),
			)
			.execute();
	});

	return yield* Effect.void;
});

export type categoryMissCreateFx = ReturnType<typeof categoryMissCreateFx>;
