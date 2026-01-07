import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FlagCreateSchema } from "~/app/flag/schema/FlagCreateSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace flagCreateFx {
	export interface Props extends FlagCreateSchema.Type {
		userId: string;
	}
}

export const flagCreateFx = Effect.fn("flagCreateFx")(function* ({
	userId,
	listingId,
}: flagCreateFx.Props) {
	const database = yield* DatabaseContextFx;

	const id = genId();

	return yield* Effect.promise(async () => {
		return database
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
