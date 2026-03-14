import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { IgnoreCreateSchema } from "~/@buyer/ignore/schema/IgnoreCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

export namespace ignoreCreateFx {
	export interface Props extends IgnoreCreateSchema.Type {
		userId: string;
	}
}

export const ignoreCreateFx = Effect.fn("ignoreCreateFx")(function* ({
	userId,
	listingId,
}: ignoreCreateFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();

	return yield* tryDbFx(async () =>
		kysely
			.insertInto("ignore")
			.values({
				id,
				userId,
				listingId,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow(),
	);
});

export type ignoreCreateFx = ReturnType<typeof ignoreCreateFx>;
