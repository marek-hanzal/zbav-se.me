import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FavouriteCreateSchema } from "~/@user/favourite/schema/FavouriteCreateSchema";
import { favouriteFetchFx } from "~/app/favourite/fx/favouriteFetchFx";
import { feedFetchFx } from "~/app/feed/fx/feedFetchFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

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
	const database = yield* DatabaseContextFx;

	const id = genId();

	yield* feedFetchFx({
		where: {
			id: feedId,
		},
		scope: {
			userId,
		},
	});

	yield* Effect.promise(async () => {
		return database
			.insertInto("favourite")
			.values({
				...data,
				id,
				userId,
				feedId,
				createdAt: new Date(),
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

