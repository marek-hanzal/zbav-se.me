import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { FeedCreateSchema } from "~/@buyer/feed/server/schema/FeedCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace seedFeedInsertFx {
	export interface Props extends FeedCreateSchema.Type {
		userId: string;
	}
}

export const seedFeedInsertFx = Effect.fn("seedFeedInsertFx")(function* ({
	userId,
	query,
	...data
}: seedFeedInsertFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();
	const now = dateContext.now().toJSDate();

	yield* tryDbFx(async () =>
		kysely
			.insertInto("feed")
			.values({
				...data,
				id,
				userId,
				uploadId: null,
				query: JSON.stringify(query) as any,
				createdAt: now,
				updatedAt: now,
			})
			.executeTakeFirstOrThrow(),
	);

	return {
		id,
	};
});

export type seedFeedInsertFx = ReturnType<typeof seedFeedInsertFx>;
