import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { favouriteFetchFx } from "~/buyer/favourite/server/fx/favouriteFetchFx";
import type { FavouriteCreateSchema } from "~/buyer/favourite/server/schema/FavouriteCreateSchema";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace favouriteCreateFx {
	export interface Props extends FavouriteCreateSchema.Type {
		userId: string;
	}
}

export const favouriteCreateFx = Effect.fn("favouriteCreateFx")(function* ({
	userId,
	feedId,
	...data
}: favouriteCreateFx.Props) {
	const logger = yield* getLoggerFx("favouriteCreateFx", "favourite");
	logger.trace("Request", {
		userId,
		feedId,
		...data,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();

	yield* feedFetchFx({
		where: {
			id: feedId,
		},
		scope: {
			userId,
		},
	});

	yield* tryDbFx(async () =>
		kysely
			.insertInto("favourite")
			.values({
				...data,
				id,
				userId,
				feedId,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow(),
	);

	return yield* favouriteFetchFx({
		where: {
			id,
		},
		scope: {
			userId,
		},
	});
});

export type favouriteCreateFx = ReturnType<typeof favouriteCreateFx>;
