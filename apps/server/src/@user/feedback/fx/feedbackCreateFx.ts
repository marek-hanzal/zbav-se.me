import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@user/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import type { FeedbackCreateSchema } from "../schema/FeedbackCreateSchema";

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
				listingId,
				event: type,
			}).pipe(Effect.ignore);

			yield* Effect.tryPromise({
				async try() {
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
						.returningAll()
						.executeTakeFirstOrThrow();
				},
				catch() {
					return new InvalidRequestError({
						message: "You have already provided feedback for this listing",
					});
				},
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
