import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer-user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@buyer-user/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@buyer-session/listing-event/fx/listingEventCreateFx";
import type { ThumbCreateSchema } from "~/@buyer-user/thumb/schema/ThumbCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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

			yield* Effect.promise(async () => {
				return kysely
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
					.executeTakeFirstOrThrow();
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
