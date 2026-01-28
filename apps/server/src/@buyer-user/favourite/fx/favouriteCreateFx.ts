import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { FavouriteCreateSchema } from "~/@buyer-user/favourite/schema/FavouriteCreateSchema";
import { feedFetchFx } from "~/@buyer-user/feed/fx/feedFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { favouriteFetchFx } from "~/@buyer-user/favourite/fx/favouriteFetchFx";

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

	yield* Effect.promise(async () => {
		return kysely
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
