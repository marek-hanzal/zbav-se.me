import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { IgnoreCreateSchema } from "~/@buyer-user/ignore/schema/IgnoreCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace ignoreCreateFx {
	export interface Props extends IgnoreCreateSchema.Type {
		userId: string;
	}
}

export const ignoreCreateFx = Effect.fn("ignoreCreateFx")(function* ({
	userId,
	listingId,
}: ignoreCreateFx.Props) {
	yield* withTraceFx({
		fx: "ignoreCreateFx",
		input: { userId, listingId },
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();

	return yield* Effect.promise(async () => {
		return kysely
			.insertInto("ignore")
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

export type ignoreCreateFx = ReturnType<typeof ignoreCreateFx>;
