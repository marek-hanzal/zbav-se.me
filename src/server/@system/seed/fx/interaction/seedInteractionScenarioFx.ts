import { Effect } from "effect";
import type { DateTime } from "luxon";
import { list } from "@/lib/common/rangedom";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionDisputeFx as buyerDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionRejectFx as buyerRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionDisputeFx as sellerDisputeFx } from "~/seller/transaction/server/fx/transactionDisputeFx";
import { transactionRejectFx as sellerRejectFx } from "~/seller/transaction/server/fx/transactionRejectFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import MessagePackage from "~/server/@system/seed/data/message-package.json" with { type: "json" };
import MessagePersonal from "~/server/@system/seed/data/message-personal.json" with {
	type: "json",
};
import BuyerText from "~/server/@system/seed/data/message-text-buyer.json" with { type: "json" };
import SellerText from "~/server/@system/seed/data/message-text-seller.json" with { type: "json" };
import { type InteractionTimeline, withRandomInt } from "~/server/@system/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/server/@system/seed/fx/time/withSeedNowFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

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

	yield* transactionAcceptFx({
		userId: sellerId,
		transactionId: transaction.id,
	}).pipe(withSeedNowFx(timeline.acceptAt));

	yield* transactionEntryCreateFx({
		userId: actorUserId,
		kind: "text",
		transactionId: transaction.id,
		payload: {
			text: BuyerText.length > 0 ? list(BuyerText) : "Hi, is this still available?",
		},
	}).pipe(withSeedNowFx(timeline.buyerMessageAt));

	yield* transactionEntryCreateFx({
		userId: sellerId,
		kind: "text",
		transactionId: transaction.id,
		payload: {
			text: SellerText.length > 0 ? list(SellerText) : "Yes, still available.",
		},
	}).pipe(withSeedNowFx(timeline.sellerMessageAt));

	if (Math.random() < 0.6) {
		yield* transactionEntryCreateFx({
			userId: sellerId,
			kind: "location",
			transactionId: transaction.id,
			payload: {
				locationId,
			},
		}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);
	}

	if (Math.random() < 0.4 && MessagePersonal.length > 0) {
		const personal = list(MessagePersonal);
		yield* transactionEntryCreateFx({
			userId: actorUserId,
			kind: "personal",
			transactionId: transaction.id,
			payload: {
				name: personal.name,
				phone: personal.phone,
				email: personal.email,
			},
		}).pipe(withSeedNowFx(withMetaAt()), Effect.ignore);
	}

	if (Math.random() < 0.3 && MessagePackage.length > 0) {
		const pack = list(MessagePackage);
		yield* transactionEntryCreateFx({
			userId: sellerId,
			kind: "package",
			transactionId: transaction.id,
			payload: {
				link: pack.link,
				number: pack.number,
			},
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

	yield* transactionResolveFx({
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
		yield* transactionSuccessFx({
			userId: actorUserId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(finalAt));
		return transaction.id;
	}

	yield* transactionCloseFx({
		userId: actorUserId,
		transactionId: transaction.id,
	}).pipe(withSeedNowFx(finalAt));

	return transaction.id;
});

export type seedInteractionScenarioFx = ReturnType<typeof seedInteractionScenarioFx>;
