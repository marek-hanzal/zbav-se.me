import { list } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import type { DateTime } from "luxon";
import { favouriteToggleFx } from "~/@buyer-user/favourite/fx/favouriteToggleFx";
import { flagToggleFx } from "~/@buyer-user/flag/fx/flagToggleFx";
import { ignoreToggleFx } from "~/@buyer-user/ignore/fx/ignoreToggleFx";
import { transactionCreateFx } from "~/@buyer-user/transaction/fx/transactionCreateFx";
import { transactionStatusCloseFx } from "~/@buyer-user/transaction-status/fx/transactionStatusCloseFx";
import { transactionStatusDisputeFx as buyerDisputeFx } from "~/@buyer-user/transaction-status/fx/transactionStatusDisputeFx";
import { transactionStatusRejectFx as buyerRejectFx } from "~/@buyer-user/transaction-status/fx/transactionStatusRejectFx";
import { transactionStatusSuccessFx } from "~/@buyer-user/transaction-status/fx/transactionStatusSuccessFx";
import { transactionStatusAcceptFx } from "~/@seller-user/transaction-status/fx/transactionStatusAcceptFx";
import { transactionStatusDisputeFx as sellerDisputeFx } from "~/@seller-user/transaction-status/fx/transactionStatusDisputeFx";
import { transactionStatusRejectFx as sellerRejectFx } from "~/@seller-user/transaction-status/fx/transactionStatusRejectFx";
import { transactionStatusResolveFx } from "~/@seller-user/transaction-status/fx/transactionStatusResolveFx";
import { transactionMessageLocationCreateFx } from "~/@user/transaction-message-location/fx/transactionMessageLocationCreateFx";
import { transactionMessagePackageCreateFx } from "~/@user/transaction-message-package/fx/transactionMessagePackageCreateFx";
import { transactionMessagePersonalCreateFx } from "~/@user/transaction-message-personal/fx/transactionMessagePersonalCreateFx";
import { transactionMessageTextCreateFx } from "~/@user/transaction-message-text/fx/transactionMessageTextCreateFx";
import MessagePackage from "~/seed/data/message-package.json";
import MessagePersonal from "~/seed/data/message-personal.json";
import BuyerText from "~/seed/data/message-text-buyer.json";
import SellerText from "~/seed/data/message-text-seller.json";
import { type InteractionTimeline, withRandomInt } from "~/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/seed/fx/time/withSeedNowFx";

type InteractionVariant =
	| "seller_reject_pending"
	| "buyer_reject_pending"
	| "accept_then_seller_reject"
	| "accept_then_buyer_reject"
	| "accept_resolve_success"
	| "accept_resolve_close"
	| "accept_resolve_buyer_dispute_success"
	| "accept_resolve_buyer_dispute_close"
	| "accept_resolve_seller_dispute_success"
	| "accept_resolve_seller_dispute_close";

const InteractionVariantPool: InteractionVariant[] = [
	"seller_reject_pending",
	"buyer_reject_pending",
	"accept_then_seller_reject",
	"accept_then_buyer_reject",
	"accept_resolve_success",
	"accept_resolve_success",
	"accept_resolve_close",
	"accept_resolve_close",
	"accept_resolve_buyer_dispute_success",
	"accept_resolve_buyer_dispute_close",
	"accept_resolve_seller_dispute_success",
	"accept_resolve_seller_dispute_close",
];

export const seedInteractionScenarioFx = Effect.fn("seedInteractionScenarioFx")(function* ({
	actorUserId,
	listingId,
	sellerId,
	locationId,
	feedId,
	timeline,
}: {
	actorUserId: string;
	listingId: string;
	sellerId: string;
	locationId: string;
	feedId: string;
	timeline: InteractionTimeline;
}) {
	const variant = list(InteractionVariantPool);
	let metaCursor = timeline.metadataAt;
	const withMetaAt = () => {
		const at = metaCursor;
		metaCursor = metaCursor.plus({
			minutes: withRandomInt(3, 8),
		});
		return at;
	};
	const withAtLeastGap = (target: DateTime, after: DateTime, minutes: number) => {
		const earliest = after.plus({
			minutes,
		});
		return target.toMillis() <= earliest.toMillis() ? earliest : target;
	};
	const withStepAfter = (after: DateTime, min = 3, max = 45) =>
		withAtLeastGap(
			after.plus({
				minutes: withRandomInt(min, max),
			}),
			after,
			min,
		);

	const transaction = yield* transactionCreateFx({
		userId: actorUserId,
		listingId,
	}).pipe(withSeedNowFx(timeline.createAt));

	if (variant === "seller_reject_pending") {
		yield* sellerRejectFx({
			userId: sellerId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(withStepAfter(timeline.createAt)));
		return transaction.id;
	}

	if (variant === "buyer_reject_pending") {
		yield* buyerRejectFx({
			userId: actorUserId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(withStepAfter(timeline.createAt)));
		return transaction.id;
	}

	yield* transactionStatusAcceptFx({
		userId: sellerId,
		transactionId: transaction.id,
	}).pipe(withSeedNowFx(timeline.acceptAt));

	yield* transactionMessageTextCreateFx({
		userId: actorUserId,
		transactionId: transaction.id,
		message: BuyerText.length > 0 ? list(BuyerText) : "Hi, is this still available?",
	}).pipe(withSeedNowFx(timeline.buyerMessageAt));

	yield* transactionMessageTextCreateFx({
		userId: sellerId,
		transactionId: transaction.id,
		message: SellerText.length > 0 ? list(SellerText) : "Yes, still available.",
	}).pipe(withSeedNowFx(timeline.sellerMessageAt));

	if (Math.random() < 0.6) {
		yield* transactionMessageLocationCreateFx({
			userId: sellerId,
			transactionId: transaction.id,
			locationId,
		}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);
	}

	if (Math.random() < 0.4 && MessagePersonal.length > 0) {
		const personal = list(MessagePersonal);
		yield* transactionMessagePersonalCreateFx({
			userId: actorUserId,
			transactionId: transaction.id,
			name: personal.name,
			phone: personal.phone,
			email: personal.email,
			locationId,
		}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);
	}

	if (Math.random() < 0.3 && MessagePackage.length > 0) {
		const pack = list(MessagePackage);
		yield* transactionMessagePackageCreateFx({
			userId: sellerId,
			transactionId: transaction.id,
			link: pack.link,
			number: pack.number,
		}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);
	}

	yield* favouriteToggleFx({
		userId: actorUserId,
		feedId,
		listingId,
		toggle: true,
	}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);

	yield* ignoreToggleFx({
		userId: actorUserId,
		listingId,
		toggle: Math.random() < 0.2,
	}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);

	yield* flagToggleFx({
		userId: actorUserId,
		listingId,
		toggle: Math.random() < 0.1,
	}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);

	if (variant === "accept_then_seller_reject") {
		yield* sellerRejectFx({
			userId: sellerId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(withStepAfter(metaCursor)));
		return transaction.id;
	}

	if (variant === "accept_then_buyer_reject") {
		yield* buyerRejectFx({
			userId: actorUserId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(withStepAfter(metaCursor)));
		return transaction.id;
	}

	const resolveAt = withAtLeastGap(timeline.resolveAt, metaCursor, 3);
	let finalAt = withAtLeastGap(timeline.finalAt, resolveAt, 3);

	yield* transactionStatusResolveFx({
		userId: sellerId,
		transactionId: transaction.id,
	}).pipe(withSeedNowFx(resolveAt));

	if (
		variant === "accept_resolve_buyer_dispute_success" ||
		variant === "accept_resolve_buyer_dispute_close"
	) {
		const disputeAt = withStepAfter(resolveAt, 3, 45);
		yield* buyerDisputeFx({
			userId: actorUserId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(disputeAt));
		finalAt = withAtLeastGap(finalAt, disputeAt, 3);
	}

	if (
		variant === "accept_resolve_seller_dispute_success" ||
		variant === "accept_resolve_seller_dispute_close"
	) {
		const disputeAt = withStepAfter(resolveAt, 3, 45);
		yield* sellerDisputeFx({
			userId: sellerId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(disputeAt));
		finalAt = withAtLeastGap(finalAt, disputeAt, 3);
	}

	if (
		variant === "accept_resolve_success" ||
		variant === "accept_resolve_buyer_dispute_success" ||
		variant === "accept_resolve_seller_dispute_success"
	) {
		yield* transactionStatusSuccessFx({
			userId: actorUserId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(finalAt));
		return transaction.id;
	}

	yield* transactionStatusCloseFx({
		userId: actorUserId,
		transactionId: transaction.id,
	}).pipe(withSeedNowFx(finalAt));

	return transaction.id;
});

export type seedInteractionScenarioFx = ReturnType<typeof seedInteractionScenarioFx>;
