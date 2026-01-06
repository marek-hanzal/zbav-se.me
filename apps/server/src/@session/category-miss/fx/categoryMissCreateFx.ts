import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { sql } from "kysely";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace categoryMissCreateFx {
	export interface Props {
		fulltext: string | undefined;
		limit?: number;
	}
}

export const categoryMissCreateFx = Effect.fn("categoryMissCreateFx")(function* ({
	fulltext,
	limit = 4,
}: categoryMissCreateFx.Props) {
	const database = yield* DatabaseContextFx;

	if (!fulltext || fulltext.length < limit) {
		return yield* Effect.void;
	}

	yield* Effect.promise(async () => {
		return database
			.insertInto("category_miss")
			.values({
				id: genId(),
				category: fulltext,
				count: 1,
				updatedAt: new Date(),
			})
			.onConflict((oc) =>
				oc
					.columns([
						"category",
					])
					.doUpdateSet({
						count: sql`category_miss.count + 1`,
						updatedAt: new Date(),
					}),
			)
			.execute();
	});

	return yield* Effect.void;
});

export type categoryMissCreateFx = ReturnType<typeof categoryMissCreateFx>;
