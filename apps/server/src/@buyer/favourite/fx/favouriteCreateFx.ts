import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { favouriteFetchFx } from "~/@buyer/favourite/fx/favouriteFetchFx";
import type { FavouriteCreateSchema } from "~/@buyer/favourite/schema/FavouriteCreateSchema";
import { feedFetchFx } from "~/@buyer/feed/fx/feedFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "favouriteCreateFx",
		input: {
			userId,
			feedId,
			...data,
		},
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
