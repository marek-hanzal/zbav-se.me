import { Effect } from "effect";
import { match } from "ts-pattern";
import { DateServiceFx } from "@/lib/common/date";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { paymentIntentFetchFx } from "../paymentIntentFetchFx";
import { resolveUserFx } from "../resolveUserFx";
import { sessionFetchFx } from "../sessionFetchFx";
import { bundleCloseSyncFx } from "./bundleCloseSyncFx";
import { bundleOpenSyncFx } from "./bundleOpenSyncFx";
import { subscriptionSyncFx } from "./subscriptionSyncFx";

export namespace sessionSyncFx {
	export interface Props {
		/**
		 * Session ID to refetch from Stripe.
		 */
		id: string;
		/**
		 * Event timestamp used if the current Stripe state says the one-off purchase is
		 * no longer valid.
		 */
		expiresAt: Date;
	}
}

/**
 * Syncs the latest state of one Stripe Session into local resources.
 *
 * Webhooks can arrive out of order, so this Fx does not trust the event payload. It
 * refetches the session, checks the linked PaymentIntent/Charge for refund state,
 * and then either materializes one-off purchase bundles or expires them.
 */
export const sessionSyncFx = Effect.fn("sessionSyncFx")(function* ({
	id,
	expiresAt,
}: sessionSyncFx.Props) {
	const logger = yield* getLoggerFx("sessionSyncFx");
	logger.trace("sessionSyncFx", {
		id,
		expiresAt,
	});

	const dateService = yield* DateServiceFx;

	const session = yield* sessionFetchFx({
		id,
	});

	/*
	 * Subscription checkout sessions are delegated immediately. The session only tells
	 * us which subscription changed; subscriptionSyncFx refetches the authoritative
	 * subscription state and decides whether the local bundle is active or expired.
	 * We intentionally do not continue into line items here: subscription line items
	 * are not one-off purchases and must not open purchase bundles.
	 */
	if (session.subscription) {
		yield* subscriptionSyncFx({
			subscription: session.subscription,
		});

		return yield* Effect.void;
	}

	/*
	 * Non-payment sessions have no one-off bundle contract here.
	 */
	if (session.mode !== "payment") {
		return yield* Effect.void;
	}

	const resourceBundleId = session.metadata?.resourceBundleId;
	const bundle = session.metadata?.bundle;
	const bundleKey = session.metadata?.bundleKey;

	if (!resourceBundleId || !bundle || !bundleKey) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-session-resource-bundle-metadata",
			resourceId: session.id,
			message: "Stripe checkout session resource bundle metadata is missing",
		});
	}

	if (!session.payment_intent) {
		logger.warn("Cannot resolve PaymentIntent from a Stripe checkout session", {
			id: session.id,
		});

		return yield* Effect.void;
	}

	const userId = yield* resolveUserFx({
		session,
	});

	/*
	 * Checkout Session payment_status remains paid after some refund flows. The linked
	 * PaymentIntent's latest charge is the practical source for deciding whether our
	 * local one-off purchase should be expired.
	 */
	const paymentIntent = yield* paymentIntentFetchFx({
		id: session.payment_intent,
	});

	const isClosed = match({
		paymentIntent,
		session,
	})
		.with(
			{
				session: {
					payment_status: "paid",
				},
				paymentIntent: {
					status: "canceled",
				},
			},
			{
				session: {
					payment_status: "paid",
					status: "expired",
				},
			},
			{
				paymentIntent: {
					latest_charge: {
						refunded: true,
					},
				},
			},
			() => true,
		)
		.with(
			{
				session: {
					payment_status: "paid",
				},
			},
			() => false,
		)
		.otherwise(() => true);

	const createdAt = dateService.ofSeconds(session.created).toJSDate();

	/*
	 * One Checkout Session represents one local bundle grant. The bundle key is
	 * generated before Stripe session creation and persisted in Session metadata, so
	 * sync does not need to derive identity from Stripe line items.
	 */
	if (isClosed) {
		return yield* bundleCloseSyncFx({
			key: bundleKey,
			expiresAt,
		}).pipe(Effect.ignore);
	}

	return yield* bundleOpenSyncFx({
		userId,
		resourceBundleId,
		bundle,
		key: bundleKey,
		createdAt,
	}).pipe(Effect.ignore);
});

export type sessionSyncFx = ReturnType<typeof sessionSyncFx>;
