import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { sql } from "kysely";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

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
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	if (!fulltext || fulltext.length < limit) {
		return yield* Effect.void;
	}

	const now = dateContext.now();

	yield* Effect.promise(async () => {
		return kysely
			.insertInto("category_miss")
			.values({
				id: genId(),
				category: fulltext,
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
