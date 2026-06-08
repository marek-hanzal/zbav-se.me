import { Effect } from "effect";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { DateServiceFx } from "@/lib/common/date";
import { NotFoundErrorFx } from "@/lib/common/error";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { SyncSkipErrorFx } from "../../error/SyncSkipErrorFx";
import { subscriptionFetchFx } from "../subscriptionFetchFx";
import { userResourceBundleMaterializeFx } from "~/user/resource-bundle/server/fx/userResourceBundleMaterializeFx";

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
	logger.trace("subscriptionSyncFx", {
		subscription: match(subscription)
			.with(P.string, (id) => id)
			.with(
				{
					id: P.string,
				},
				(subscription) => subscription.id,
			)
			.exhaustive(),
	});

	const resolvedSubscription = yield* subscriptionFetchFx({
		id: subscription,
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
	const resourceBundleId = resolvedSubscription.metadata.resourceBundleId;
	const itemPeriodEnd =
		resolvedSubscription.items.data
			.map((item) => item.current_period_end)
			.find((periodEnd) => Boolean(periodEnd)) ?? resolvedSubscription.cancel_at;
	const periodEnd = itemPeriodEnd ? dateContext.ofSeconds(itemPeriodEnd).toJSDate() : null;

	if (!resourceBundleId) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-subscription-resource-bundle-metadata",
			resourceId: resolvedSubscription.id,
			message: "Stripe subscription metadata does not resolve resource bundle",
		});
	}

	const bundle = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("id", "=", resourceBundleId)
			.executeTakeFirst();
	});

	if (!bundle) {
		return yield* new NotFoundErrorFx({
			resource: "resource_bundle",
			resourceId: resourceBundleId,
			message: "Stripe subscription resource bundle is missing",
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
		? dateContext.ofSeconds(resolvedSubscription.ended_at).toJSDate()
		: resolvedSubscription.canceled_at
			? dateContext.ofSeconds(resolvedSubscription.canceled_at).toJSDate()
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

	const snapshotExists = yield* dbFx(async (kysely) => {
		const [item, limit, feature] = await Promise.all([
			kysely
				.selectFrom("user_resource_bundle_item")
				.select([
					"id",
				])
				.where("userResourceBundleId", "=", userResourceBundle.id)
				.executeTakeFirst(),
			kysely
				.selectFrom("user_resource_bundle_limit")
				.select([
					"id",
				])
				.where("userResourceBundleId", "=", userResourceBundle.id)
				.executeTakeFirst(),
			kysely
				.selectFrom("user_resource_bundle_feature")
				.select([
					"id",
				])
				.where("userResourceBundleId", "=", userResourceBundle.id)
				.executeTakeFirst(),
		]);

		return Boolean(item || limit || feature);
	});

	if (isActive && !snapshotExists) {
		yield* userResourceBundleMaterializeFx({
			resourceBundleId: bundle.id,
			userResourceBundleId: userResourceBundle.id,
			createdAt: now,
			availableAt: now,
			limitExpiresAt: expiresAt,
			featureExpiresAt: expiresAt,
		});
	} else if (snapshotExists) {
		yield* dbFx(async (kysely) => {
			await kysely
				.updateTable("user_resource_bundle_limit")
				.set({
					expiresAt,
				})
				.where("userResourceBundleId", "=", userResourceBundle.id)
				.execute();

			return kysely
				.updateTable("user_resource_bundle_feature")
				.set({
					expiresAt,
				})
				.where("userResourceBundleId", "=", userResourceBundle.id)
				.execute();
		});
	}

	return userResourceBundle;
});

export type subscriptionSyncFx = ReturnType<typeof subscriptionSyncFx>;
