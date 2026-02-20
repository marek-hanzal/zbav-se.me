import { list } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { favouriteToggleFx } from "~/@buyer-user/favourite/fx/favouriteToggleFx";
import { flagToggleFx } from "~/@buyer-user/flag/fx/flagToggleFx";
import { ignoreToggleFx } from "~/@buyer-user/ignore/fx/ignoreToggleFx";
import { transactionCreateFx } from "~/@buyer-user/transaction/fx/transactionCreateFx";
import { transactionStatusCloseFx } from "~/@buyer-user/transaction-status/fx/transactionStatusCloseFx";
import { transactionStatusSuccessFx } from "~/@buyer-user/transaction-status/fx/transactionStatusSuccessFx";
import { transactionStatusAcceptFx } from "~/@seller-user/transaction-status/fx/transactionStatusAcceptFx";
import { transactionStatusResolveFx } from "~/@seller-user/transaction-status/fx/transactionStatusResolveFx";
import { transactionMessageLocationCreateFx } from "~/@user/transaction-message-location/fx/transactionMessageLocationCreateFx";
import { transactionMessagePackageCreateFx } from "~/@user/transaction-message-package/fx/transactionMessagePackageCreateFx";
import { transactionMessagePersonalCreateFx } from "~/@user/transaction-message-personal/fx/transactionMessagePersonalCreateFx";
import { transactionMessageTextCreateFx } from "~/@user/transaction-message-text/fx/transactionMessageTextCreateFx";
import MessagePackage from "~/seed/data/message-package.json";
import MessagePersonal from "~/seed/data/message-personal.json";
import BuyerText from "~/seed/data/message-text-buyer.json";
import SellerText from "~/seed/data/message-text-seller.json";
import type { InteractionTimeline } from "~/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/seed/fx/time/withSeedNowFx";

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
	const transaction = yield* transactionCreateFx({
		userId: actorUserId,
		listingId,
	}).pipe(withSeedNowFx(timeline.createAt));

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
		}).pipe(withSeedNowFx(timeline.metadataAt), Effect.ignore);
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
		}).pipe(withSeedNowFx(timeline.metadataAt), Effect.ignore);
	}

	if (Math.random() < 0.3 && MessagePackage.length > 0) {
		const pack = list(MessagePackage);
		yield* transactionMessagePackageCreateFx({
			userId: sellerId,
			transactionId: transaction.id,
			link: pack.link,
			number: pack.number,
		}).pipe(withSeedNowFx(timeline.metadataAt), Effect.ignore);
	}

	yield* favouriteToggleFx({
		userId: actorUserId,
		feedId,
		listingId,
		toggle: true,
	}).pipe(withSeedNowFx(timeline.metadataAt), Effect.ignore);

	yield* ignoreToggleFx({
		userId: actorUserId,
		listingId,
		toggle: Math.random() < 0.2,
	}).pipe(withSeedNowFx(timeline.metadataAt), Effect.ignore);

	yield* flagToggleFx({
		userId: actorUserId,
		listingId,
		toggle: Math.random() < 0.1,
	}).pipe(withSeedNowFx(timeline.metadataAt), Effect.ignore);

	yield* transactionStatusResolveFx({
		userId: sellerId,
		transactionId: transaction.id,
	}).pipe(withSeedNowFx(timeline.resolveAt));

	if (Math.random() < 0.7) {
		yield* transactionStatusSuccessFx({
			userId: actorUserId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(timeline.finalAt));
	} else {
		yield* transactionStatusCloseFx({
			userId: actorUserId,
			transactionId: transaction.id,
		}).pipe(withSeedNowFx(timeline.finalAt));
	}

	return transaction.id;
});

export type seedInteractionScenarioFx = ReturnType<typeof seedInteractionScenarioFx>;
