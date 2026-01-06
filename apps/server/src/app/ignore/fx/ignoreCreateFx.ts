import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace ignoreCreateFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const ignoreCreateFx = Effect.fn("ignoreCreateFx")(function* ({
	userId,
	listingId,
}: ignoreCreateFx.Props) {
	const database = yield* DatabaseContextFx;

	const id = genId();

	return yield* Effect.promise(async () => {
		return database
			.insertInto("ignore")
			.values({
				id,
				userId,
				listingId,
				createdAt: new Date(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow();
	});
});

export type ignoreCreateFx = ReturnType<typeof ignoreCreateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<ignoreCreateFx>, UserContextFx>>;
