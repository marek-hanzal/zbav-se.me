import { Effect } from "effect";
import type { Stripe } from "stripe";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { stripeClientFx } from "../stripeClientFx";
import { sessionSyncFx } from "./sessionSyncFx";
import { subscriptionSyncFx } from "./subscriptionSyncFx";

export namespace syncFx {
	export interface Grant {
		bundleId: string;
		subId: string;
		expiresAt: Date | null;
	}

	export interface Props {
		/**
		 * Stripe Customer ID that should be reconciled from the current Stripe API state.
		 */
		customerId: string;
	}
}

/**
 * Reconciles one Stripe customer from Stripe API state into local resources.
 *
 * Webhooks are only pings that tell us which customer changed. This Fx deliberately
 * ignores event payloads and lists current Stripe objects for the customer instead,
 * so event delivery order cannot drive local state transitions.
 */
export const syncFx = Effect.fn("syncFx")(function* ({ customerId }: syncFx.Props) {
	const logger = yield* getLoggerFx("syncFx");
	logger.trace("syncFx", {
		customerId,
	});

	const userStripe = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_stripe")
			.select([
				"userId",
			])
			.where("customerId", "=", customerId)
			.executeTakeFirst();
	});

	if (!userStripe) {
		return yield* Effect.void;
	}

	const dateService = yield* DateServiceFx;
	const expiresAt = dateService.now().toJSDate();
	const stripe = yield* stripeClientFx();

	const byCreated = <
		Item extends {
			created: number;
		},
	>(
		items: Item[],
	) => {
		return items.toSorted((left, right) => {
			return left.created - right.created;
		});
	};

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

	const subIdOf = (subscription: Stripe.Checkout.Session["subscription"]) => {
		return typeof subscription === "string" ? subscription : (subscription?.id ?? null);
	};

	const sessionBundles = new Map<string, string>();
	for (const session of snapshot.sessions) {
		const subId = subIdOf(session.subscription);
		const bundleId = session.metadata?.resourceBundleId;

		if (subId && bundleId) {
			sessionBundles.set(subId, bundleId);
		}
	}

	const grants = new Map<string, syncFx.Grant>();
	for (const subscription of snapshot.currentSubs) {
		const bundleId =
			subscription.metadata.resourceBundleId ?? sessionBundles.get(subscription.id);

		if (!bundleId) {
			continue;
		}

		const periodEnd =
			subscription.items.data
				.map((item) => item.current_period_end)
				.find((periodEnd) => Boolean(periodEnd)) ?? subscription.cancel_at;
		const grant: syncFx.Grant = {
			bundleId,
			subId: subscription.id,
			expiresAt:
				subscription.cancel_at_period_end && periodEnd
					? dateService.ofSeconds(periodEnd).toJSDate()
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

	/*
	 * First replay all Stripe objects chronologically. Then apply current subscription
	 * grants fetched by Stripe status, so old canceled objects cannot close a bundle
	 * while another subscription still grants access.
	 */
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
				expiresAt,
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
			return dbFx(async (kysely) => {
				const userResourceBundle = await kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId: userStripe.userId,
						resourceBundleId: grant.bundleId,
						createdAt: expiresAt,
						availableAt: expiresAt,
						expiresAt: grant.expiresAt,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"userId",
								"resourceBundleId",
							])
							.doUpdateSet({
								availableAt: expiresAt,
								expiresAt: grant.expiresAt,
							});
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				await kysely
					.insertInto("user_resource_bundle_stripe")
					.values({
						id: genId(),
						userResourceBundleId: userResourceBundle.id,
						subscriptionId: grant.subId,
						createdAt: expiresAt,
					})
					.onConflict((oc) => {
						return oc.column("userResourceBundleId").doUpdateSet({
							subscriptionId: grant.subId,
						});
					})
					.execute();
			});
		},
		{
			discard: true,
			concurrency: 1,
		},
	);
});
