import { list } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { favouriteToggleFx } from "~/@buyer-user/favourite/fx/favouriteToggleFx";
import { flagToggleFx } from "~/@buyer-user/flag/fx/flagToggleFx";
import { ignoreToggleFx } from "~/@buyer-user/ignore/fx/ignoreToggleFx";
import { thumbCreateFx } from "~/@buyer-user/thumb/fx/thumbCreateFx";
import { transactionCreateFx } from "~/@buyer-user/transaction/fx/transactionCreateFx";
import { transactionStatusCloseFx } from "~/@buyer-user/transaction-status/fx/transactionStatusCloseFx";
import { transactionStatusSuccessFx } from "~/@buyer-user/transaction-status/fx/transactionStatusSuccessFx";
import { transactionStatusAcceptFx } from "~/@seller-user/transaction-status/fx/transactionStatusAcceptFx";
import { transactionStatusResolveFx } from "~/@seller-user/transaction-status/fx/transactionStatusResolveFx";
import { transactionMessageTextCreateFx } from "~/@user/transaction-message-text/fx/transactionMessageTextCreateFx";

export const seedInteractionScenarioFx = Effect.fn("seedInteractionScenarioFx")(function* ({
	actorUserId,
	listingId,
	sellerId,
	feedId,
}: {
	actorUserId: string;
	listingId: string;
	sellerId: string;
	feedId: string;
}) {
	const transaction = yield* transactionCreateFx({
		userId: actorUserId,
		listingId,
	});

	yield* transactionStatusAcceptFx({
		userId: sellerId,
		transactionId: transaction.id,
	});

	yield* transactionMessageTextCreateFx({
		userId: actorUserId,
		transactionId: transaction.id,
		message: "Hi, I am interested. Is this still available?",
	});

	yield* transactionMessageTextCreateFx({
		userId: sellerId,
		transactionId: transaction.id,
		message: "Yes, still available. We can arrange details.",
	});

	yield* transactionStatusResolveFx({
		userId: sellerId,
		transactionId: transaction.id,
	});

	if (Math.random() < 0.7) {
		yield* transactionStatusSuccessFx({
			userId: actorUserId,
			transactionId: transaction.id,
		});
	} else {
		yield* transactionStatusCloseFx({
			userId: actorUserId,
			transactionId: transaction.id,
		});
	}

	yield* favouriteToggleFx({
		userId: actorUserId,
		feedId,
		listingId,
		toggle: true,
	}).pipe(Effect.ignore);

	yield* ignoreToggleFx({
		userId: actorUserId,
		listingId,
		toggle: Math.random() < 0.2,
	}).pipe(Effect.ignore);

	yield* flagToggleFx({
		userId: actorUserId,
		listingId,
		toggle: Math.random() < 0.1,
	}).pipe(Effect.ignore);

	yield* thumbCreateFx({
		userId: actorUserId,
		listingId,
		type: list([
			"like",
			"dislike",
		]),
	}).pipe(Effect.ignore);

	return transaction.id;
});

export type seedInteractionScenarioFx = ReturnType<typeof seedInteractionScenarioFx>;
