import { Effect } from "effect";
import type { Stripe } from "stripe";
import { DateServiceFx } from "@/lib/common/date";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { userBundleFeatureCopyFx } from "~/user/resource-bundle/server/fx/userBundleFeatureCopyFx";
import { userBundleItemCopyFx } from "~/user/resource-bundle/server/fx/userBundleItemCopyFx";
import { userBundleLimitCopyFx } from "~/user/resource-bundle/server/fx/userBundleLimitCopyFx";
import { userBundleEntitlementsExpireFx } from "~/user/resource-bundle/server/fx/userBundleEntitlementsExpireFx";
import { userBundleSnapshotExistsFx } from "~/user/resource-bundle/server/fx/userBundleSnapshotExistsFx";
import { SyncSkipErrorFx } from "../../error/SyncSkipErrorFx";
import { subscriptionFetchFx } from "../subscriptionFetchFx";
import { subscriptionBundleUpsertFx } from "./subscriptionBundleUpsertFx";

export namespace subscriptionSyncFx {
	export interface Props {
		/** Subscription ID or expanded object. The current subscription is always refetched. */
		subscription: string | Stripe.Subscription;
		/** Checkout Session metadata fallback used while Stripe propagates subscription metadata. */
		fallback?: {
			bundleId?: string;
			userId?: string;
		};
	}
}

const subscriptionId = (subscription: string | Stripe.Subscription) => {
	return typeof subscription === "string" ? subscription : subscription.id;
};

const customerIdOf = (customer: Stripe.Subscription["customer"]) => {
	return typeof customer === "string" ? customer : customer.id;
};

/** Syncs one Stripe subscription into one local user resource bundle. */
export const subscriptionSyncFx = Effect.fn("subscriptionSyncFx")(function* ({
	subscription: source,
	fallback,
}: subscriptionSyncFx.Props) {
	const logger = yield* getLoggerFx("subscriptionSyncFx");
	logger.trace("subscriptionSyncFx", {
		subscription: subscriptionId(source),
	});

	const subscription = yield* subscriptionFetchFx({
		id: source,
	});
	const date = yield* DateServiceFx;
	const now = date.now().toJSDate();
	const bundleId = subscription.metadata.resourceBundleId ?? fallback?.bundleId;

	if (!bundleId) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-subscription-resource-bundle-metadata",
			resourceId: subscription.id,
			message: "Stripe subscription metadata does not resolve resource bundle",
		});
	}

	const bundle = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
			])
			.where("id", "=", bundleId)
			.executeTakeFirst();
	});

	if (!bundle) {
		return yield* new NotFoundErrorFx({
			resource: "resource_bundle",
			resourceId: bundleId,
			message: "Stripe subscription resource bundle is missing",
		});
	}

	let user:
		| {
				userId: string;
		  }
		| undefined;

	if (fallback?.userId) {
		user = {
			userId: fallback.userId,
		};
	} else {
		user = yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("user_stripe")
				.select([
					"userId",
				])
				.where("customerId", "=", customerIdOf(subscription.customer))
				.executeTakeFirst();
		});
	}

	if (!user) {
		return yield* new SyncSkipErrorFx({
			message: "Stripe subscription customer is not linked to a user",
			reason: "subscription customer missing",
			cause: {
				customerId: customerIdOf(subscription.customer),
				subscription,
			},
		});
	}

	const active = subscription.status === "active" || subscription.status === "trialing";
	const itemEnd =
		subscription.items.data.map((item) => item.current_period_end).find(Boolean) ??
		subscription.cancel_at;
	const periodEnd = itemEnd ? date.ofSeconds(itemEnd).toJSDate() : null;
	const endedAt = subscription.ended_at
		? date.ofSeconds(subscription.ended_at).toJSDate()
		: subscription.canceled_at
			? date.ofSeconds(subscription.canceled_at).toJSDate()
			: null;
	const expiresAt = active
		? subscription.cancel_at_period_end
			? periodEnd
			: null
		: (endedAt ?? now);

	const assignment = yield* subscriptionBundleUpsertFx({
		userId: user.userId,
		bundleId: bundle.id,
		subscriptionId: subscription.id,
		createdAt: now,
		availableAt: now,
		expiresAt,
	});
	const hasSnapshot = yield* userBundleSnapshotExistsFx({
		assignmentId: assignment.id,
	});

	if (active && !hasSnapshot) {
		const copy = {
			bundleId: bundle.id,
			assignmentId: assignment.id,
			createdAt: now,
			availableAt: now,
		} as const;

		yield* Effect.all(
			[
				userBundleItemCopyFx(copy),
				userBundleLimitCopyFx({
					...copy,
					expiresAt,
				}),
				userBundleFeatureCopyFx({
					...copy,
					expiresAt,
				}),
			],
			{
				discard: true,
				concurrency: 3,
			},
		);
	} else if (hasSnapshot) {
		yield* userBundleEntitlementsExpireFx({
			assignmentId: assignment.id,
			expiresAt,
		});
	}

	return assignment;
});

export type subscriptionSyncFx = ReturnType<typeof subscriptionSyncFx>;
