import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

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
	const kysely = yield* KyselyContextFx;

	const id = genId();

	return yield* Effect.promise(async () => {
		return kysely
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
