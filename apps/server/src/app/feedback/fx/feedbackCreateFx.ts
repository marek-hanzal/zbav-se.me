import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FeedbackCreateSchema } from "~/@user/feedback/schema/FeedbackCreateSchema";
import { listingCheckIfOwnFx } from "~/app/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/app/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/app/listing-event/fx/listingEventCreateFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
			const database = yield* DatabaseContextFx;

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
				return database
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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<feedbackCreateFx>, UserContextFx>>;
