import { Effect } from "effect";
import { feedFetchFx } from "~/buyer-feed/fx/feedFetchFx";
import { favouriteFetchFx } from "~/buyer-listing-favourite/fx/favouriteFetchFx";
import type { FavouriteCreateSchema } from "~/buyer-listing-favourite/schema/FavouriteCreateSchema";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

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
	const logger = yield* getLoggerFx("favouriteCreateFx", "listing_favourite");
	logger.trace("Request", {
		userId,
		feedId,
		...data,
	});

	const dateContext = yield* DateServiceFx;

	const id = genId();

	yield* feedFetchFx({
		where: {
			id: feedId,
		},
		scope: {
			userId,
		},
	});

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("listing_favourite")
			.values({
				...data,
				id,
				userId,
				feedId,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow();
	});

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
