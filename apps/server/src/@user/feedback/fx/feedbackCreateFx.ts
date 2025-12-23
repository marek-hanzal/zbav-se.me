import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import type { FeedbackCreateSchema } from "../schema/FeedbackCreateSchema";

export namespace feedbackCreateFx {
	export type Props = FeedbackCreateSchema.Type;
}

export const feedbackCreateFx = ({ listingId, type }: feedbackCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const id = genId();

		yield* listingCheckIfOwnFx({
			listingId,
			message: "You cannot provide feedback on your own listing.",
		});

		yield* listingEventCreateFx({
			listingId,
			event: type,
		});

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("feedback")
					.values({
						id,
						userId: user.id,
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
	});
};

export type feedbackCreateFx = ReturnType<typeof feedbackCreateFx>;
