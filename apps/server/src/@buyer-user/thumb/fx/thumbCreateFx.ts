import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer-session/listing/fx/listingCheckIfOwnFx";
import { listingEventCreateFx } from "~/@buyer-session/listing-event/fx/listingEventCreateFx";
import { listingFetchFx } from "~/@buyer-user/listing/fx/listingFetchFx";
import type { ThumbCreateSchema } from "~/@buyer-user/thumb/schema/ThumbCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { mapToError } from "~/database/mapToError";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace thumbCreateFx {
	export interface Props extends ThumbCreateSchema.Type {
		userId: string;
	}
}

export const thumbCreateFx = Effect.fn("thumbCreateFx")(function* ({
	userId,
	listingId,
	type,
	...data
}: thumbCreateFx.Props) {
	yield* withTraceFx({
		fx: "thumbCreateFx",
		input: {
			userId,
			listingId,
			type,
			...data,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();

			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot provide thumb on your own listing.",
			});

			yield* listingEventCreateFx({
				userId,
				listingId,
				event: type,
			}).pipe(Effect.ignore);

			yield* Effect.tryPromise({
				try: async () =>
					kysely
						.insertInto("thumb")
						.values({
							...data,
							id,
							userId,
							listingId,
							type,
							createdAt: dateContext.now().toJSDate(),
						})
						.onConflict((eb) => eb.doNothing())
						.returningAll()
						.executeTakeFirstOrThrow(),
				catch: mapToError({
					conflict: "Thumb already exists",
				}),
			});

			return yield* listingFetchFx({
				userId,
				where: {
					id: listingId,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type thumbCreateFx = ReturnType<typeof thumbCreateFx>;
