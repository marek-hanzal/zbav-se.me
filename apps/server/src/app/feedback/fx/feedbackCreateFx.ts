import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { FeedbackCreateSchema } from "~/app/feedback/schema/FeedbackCreateSchema";
import { listingCheckIfOwnFx } from "~/app/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/app/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/app/listing-event/fx/listingEventCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace feedbackCreateFx {
	export interface Props extends FeedbackCreateSchema.Type {
		userId: string;
	}
}

export const feedbackCreateFx = Effect.fn("feedbackCreateFx")(function* ({
	userId,
	listingId,
	type,
	...data
}: feedbackCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const kysely = yield* KyselyContextFx;

			const id = genId();

			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot provide feedback on your own listing.",
			});

			yield* listingEventCreateFx({
				userId,
				listingId,
				event: type,
			}).pipe(Effect.ignore);

			yield* Effect.promise(async () => {
				return kysely
					.insertInto("feedback")
					.values({
						...data,
						id,
						userId,
						listingId,
						type,
						createdAt: new Date(),
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

export type feedbackCreateFx = ReturnType<typeof feedbackCreateFx>;
