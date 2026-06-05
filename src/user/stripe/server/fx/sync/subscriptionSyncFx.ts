import { Effect } from "effect";
import { DateTime } from "luxon";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { subscriptionFetchFx } from "../subscriptionFetchFx";
import { SyncSkipErrorFx } from "../../error/SyncSkipErrorFx";

export namespace subscriptionSyncFx {
	export interface Props {
		/**
		 * Subscription ID or expanded object. The current subscription is always refetched.
		 */
		subscription: string | Stripe.Subscription;
	}
}

/**
 * Syncs one Stripe subscription into the user's active resource bundles.
 *
 * Active/trialing subscriptions keep the bundle active unless cancellation is
 * scheduled for period end. Any non-active subscription expires the assignment
 * immediately, preferring Stripe's ended/canceled timestamp when available.
 */
export const subscriptionSyncFx = Effect.fn("subscriptionSyncFx")(function* ({
	subscription,
}: subscriptionSyncFx.Props) {
	const logger = yield* getLoggerFx("subscriptionSyncFx");
	const resolvedSubscription = yield* subscriptionFetchFx({
		id: subscription,
	});
	logger.trace("subscriptionSyncFx", {
		subscriptionId: resolvedSubscription.id,
	});

	const dateContext = yield* DateServiceFx;
	const now = dateContext.now().toJSDate();
	const customerId = match(resolvedSubscription.customer)
		.with(P.string, (customer) => customer)
		.with(
			{
				id: P.string,
			},
			(customer) => customer.id,
		)
		.exhaustive();
	const resourceBundleName =
		resolvedSubscription.metadata.bundle ||
		(resolvedSubscription.items.data
			.map((item) => item.price.metadata.bundle)
			.find((bundle) => Boolean(bundle)) ??
			null);
	const itemPeriodEnd =
		resolvedSubscription.items.data
			.map((item) => item.current_period_end)
			.find((periodEnd) => Boolean(periodEnd)) ?? resolvedSubscription.cancel_at;
	const periodEnd = itemPeriodEnd ? DateTime.fromSeconds(itemPeriodEnd).toJSDate() : null;

	if (!resourceBundleName) {
		return yield* new SyncSkipErrorFx({
			message: "Stripe subscription metadata does not resolve resource bundle",
			reason: "subscription metadata missing",
			cause: {
				subscription,
			},
		});
	}

	const bundle = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("name", "=", resourceBundleName)
			.executeTakeFirst();
	});

	if (!bundle) {
		return yield* new SyncSkipErrorFx({
			message: "Stripe subscription resource bundle is missing",
			reason: "subscription bundle missing",
			cause: {
				resourceBundleName,
				subscription,
			},
		});
	}

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
		return yield* new SyncSkipErrorFx({
			message: "Stripe subscription customer is not linked to a user",
			reason: "subscription customer missing",
			cause: {
				customerId,
				subscription,
			},
		});
	}

	const isActive = match(resolvedSubscription.status)
		.with(P.union("active", "trialing"), () => true)
		.otherwise(() => false);
	/*
	 * Stripe shape has moved current-period fields around API versions, so period end
	 * is normalized above and cancellation timestamps are read defensively here.
	 */
	const endedAt = resolvedSubscription.ended_at
		? DateTime.fromSeconds(resolvedSubscription.ended_at).toJSDate()
		: resolvedSubscription.canceled_at
			? DateTime.fromSeconds(resolvedSubscription.canceled_at).toJSDate()
			: null;
	const expiresAt = isActive
		? resolvedSubscription.cancel_at_period_end
			? periodEnd
			: null
		: (endedAt ?? now);

	const userResourceBundle = yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("user_resource_bundle")
			.values({
				id: genId(),
				userId: userStripe.userId,
				resourceBundleId: bundle.id,
				createdAt: now,
				availableAt: now,
				expiresAt,
			})
			.onConflict((oc) => {
				return oc
					.columns([
						"userId",
						"resourceBundleId",
					])
					.doUpdateSet({
						availableAt: now,
						expiresAt,
					});
			})
			.returning([
				"id",
			])
			.executeTakeFirstOrThrow();
	});

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("user_resource_bundle_stripe")
			.values({
				id: genId(),
				userResourceBundleId: userResourceBundle.id,
				subscriptionId: resolvedSubscription.id,
				createdAt: now,
			})
			.onConflict((oc) => {
				return oc.column("userResourceBundleId").doUpdateSet({
					subscriptionId: resolvedSubscription.id,
				});
			})
			.execute();
	});

	return userResourceBundle;
});

export type subscriptionSyncFx = ReturnType<typeof subscriptionSyncFx>;
