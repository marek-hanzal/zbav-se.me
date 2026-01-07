import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { FlagCreateSchema } from "~/app/flag/schema/FlagCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace flagCreateFx {
	export interface Props extends FlagCreateSchema.Type {
		userId: string;
	}
}

export const flagCreateFx = Effect.fn("flagCreateFx")(function* ({
	userId,
	listingId,
}: flagCreateFx.Props) {
	const kysely = yield* KyselyContextFx;

	const id = genId();

	return yield* Effect.promise(async () => {
		return kysely
			.insertInto("flag")
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

export type flagCreateFx = ReturnType<typeof flagCreateFx>;
