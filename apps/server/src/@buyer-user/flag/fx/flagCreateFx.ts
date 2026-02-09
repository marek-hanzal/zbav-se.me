import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { FlagCreateSchema } from "~/@buyer-user/flag/schema/FlagCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace flagCreateFx {
	export interface Props extends FlagCreateSchema.Type {
		userId: string;
	}
}

export const flagCreateFx = Effect.fn("flagCreateFx")(function* ({
	userId,
	listingId,
}: flagCreateFx.Props) {
	yield* withTraceFx({
		fx: "flagCreateFx",
		input: { userId, listingId },
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();

	return yield* Effect.promise(async () => {
		return kysely
			.insertInto("flag")
			.values({
				id,
				userId,
				listingId,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow();
	});
});

export type flagCreateFx = ReturnType<typeof flagCreateFx>;
