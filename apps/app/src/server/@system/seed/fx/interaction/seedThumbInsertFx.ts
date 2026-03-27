import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { list } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/@buyer/listing-event/server/fx/listingEventCreateFx";
import type { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace seedThumbInsertFx {
	export interface Props {
		userId: string;
		listingId: string;
		type?: ThumbEnumSchema.Type;
	}
}

export const seedThumbInsertFx = Effect.fn("seedThumbInsertFx")(function* ({
	userId,
	listingId,
	type = list([
		"like",
		"dislike",
	]),
}: seedThumbInsertFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const id = genId();

	yield* listingEventCreateFx({
		userId,
		listingId,
		event: type,
	}).pipe(Effect.ignore);

	yield* tryDbFx(async () =>
		kysely
			.insertInto("thumb")
			.values({
				id,
				userId,
				listingId,
				type,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.execute(),
	);
});

export type seedThumbInsertFx = ReturnType<typeof seedThumbInsertFx>;
