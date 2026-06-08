import { Effect } from "effect";
import type { Stripe } from "stripe";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { stripeClientFx } from "../stripeClientFx";
import { sessionSyncFx } from "./sessionSyncFx";
import { subscriptionBundleUpsertFx } from "./subscriptionBundleUpsertFx";
import { subscriptionSyncFx } from "./subscriptionSyncFx";

export namespace syncFx {
	export interface Grant {
		bundleId: string;
		subscriptionId: string;
		expiresAt: Date | null;
	}

	export interface Props {
		/** Stripe Customer ID reconciled from current Stripe API state. */
		customerId: string;
	}
}

const byCreated = <
	Item extends {
		created: number;
	},
>(
	items: Item[],
) => {
	return items.toSorted((left, right) => left.created - right.created);
};

const subscriptionIdOf = (subscription: Stripe.Checkout.Session["subscription"]) => {
	return typeof subscription === "string" ? subscription : (subscription?.id ?? null);
};

/** Reconciles one Stripe customer from Stripe API state into local resources. */
export const syncFx = Effect.fn("syncFx")(function* ({ customerId }: syncFx.Props) {
	const logger = yield* getLoggerFx("syncFx");
	logger.trace("syncFx", {
		customerId,
	});

	const user = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_stripe")
			.select([
				"userId",
			])
			.where("customerId", "=", customerId)
			.executeTakeFirst();
	});

	if (!user) {
		return yield* Effect.void;
	}

	const date = yield* DateServiceFx;
	const now = date.now().toJSDate();
	const stripe = yield* stripeClientFx();
	const snapshot = yield* Effect.promise(async () => {
		const [allSubs, activeSubs, trialSubs, sessions] = await Promise.all([
			stripe.subscriptions.list({
				customer: customerId,
				status: "all",
				limit: 100,
			}),
			stripe.subscriptions.list({
				customer: customerId,
				status: "active",
				limit: 100,
			}),
			stripe.subscriptions.list({
				customer: customerId,
				status: "trialing",
				limit: 100,
			}),
			stripe.checkout.sessions.list({
				customer: customerId,
				limit: 100,
			}),
		]);

		return {
			allSubs: byCreated(allSubs.data),
			currentSubs: byCreated([
				...activeSubs.data,
				...trialSubs.data,
			]),
			sessions: byCreated(sessions.data),
		};
	});

	const sessionBundles = new Map<string, string>();
	for (const session of snapshot.sessions) {
		const subscriptionId = subscriptionIdOf(session.subscription);
		const bundleId = session.metadata?.resourceBundleId;

		if (subscriptionId && bundleId) {
			sessionBundles.set(subscriptionId, bundleId);
		}
	}

	const grants = new Map<string, syncFx.Grant>();
	for (const subscription of snapshot.currentSubs) {
		const bundleId =
			subscription.metadata.resourceBundleId ?? sessionBundles.get(subscription.id);

		if (!bundleId) {
			continue;
		}

		const itemEnd =
			subscription.items.data.map((item) => item.current_period_end).find(Boolean) ??
			subscription.cancel_at;
		const grant: syncFx.Grant = {
			bundleId,
			subscriptionId: subscription.id,
			expiresAt:
				subscription.cancel_at_period_end && itemEnd
					? date.ofSeconds(itemEnd).toJSDate()
					: null,
		};
		const stored = grants.get(bundleId);

		if (
			!stored ||
			!grant.expiresAt ||
			(stored.expiresAt && grant.expiresAt > stored.expiresAt)
		) {
			grants.set(bundleId, grant);
		}
	}

	/* Replay all objects first; then re-apply current grants so stale events cannot win. */
	yield* Effect.forEach(
		snapshot.allSubs,
		(subscription) => {
			return subscriptionSyncFx({
				subscription: subscription.id,
			}).pipe(Effect.ignore);
		},
		{
			discard: true,
			concurrency: 1,
		},
	);
	yield* Effect.forEach(
		snapshot.sessions,
		(session) => {
			return sessionSyncFx({
				id: session.id,
				expiresAt: now,
			}).pipe(Effect.ignore);
		},
		{
			discard: true,
			concurrency: 1,
		},
	);

	yield* Effect.forEach(
		Array.from(grants.values()),
		(grant) => {
			return subscriptionBundleUpsertFx({
				userId: user.userId,
				bundleId: grant.bundleId,
				subscriptionId: grant.subscriptionId,
				createdAt: now,
				availableAt: now,
				expiresAt: grant.expiresAt,
			});
		},
		{
			discard: true,
			concurrency: 1,
		},
	);
});
