import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import type { BillingSubscriptionCancelSchema } from "../schema/BillingSubscriptionCancelSchema";
import { stripeClientFx } from "./stripeClientFx";
import { subscriptionSyncFx } from "./sync/subscriptionSyncFx";

export namespace subscriptionCancelFx {
	export interface Props extends BillingSubscriptionCancelSchema.Type {
		userId: string;
	}
}

/** Cancels subscription renewal while keeping the already paid period active. */
export const subscriptionCancelFx = Effect.fn("subscriptionCancelFx")(function* ({
	userId,
	bundle,
}: subscriptionCancelFx.Props) {
	const logger = yield* getLoggerFx("subscriptionCancelFx");
	logger.trace("subscriptionCancelFx", {
		userId,
		bundle,
	});

	const date = yield* DateServiceFx;
	const now = date.now().toJSDate();
	const mapping = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_resource_bundle as assignment")
			.innerJoin(
				"resource_bundle as resourceBundle",
				"resourceBundle.id",
				"assignment.resourceBundleId",
			)
			.innerJoin(
				"user_resource_bundle_stripe as stripeLink",
				"stripeLink.userResourceBundleId",
				"assignment.id",
			)
			.innerJoin("user_stripe as userStripe", "userStripe.userId", "assignment.userId")
			.select([
				"assignment.resourceBundleId",
				"stripeLink.subscriptionId",
				"userStripe.customerId",
			])
			.where("assignment.userId", "=", userId)
			.where("resourceBundle.name", "=", bundle)
			.where("resourceBundle.type", "=", "subscription")
			.where("resourceBundle.access", "=", "public")
			.where("assignment.availableAt", "<=", now)
			.where((eb) =>
				eb.or([
					eb("assignment.expiresAt", "is", null),
					eb("assignment.expiresAt", ">", now),
				]),
			)
			.executeTakeFirst();
	});

	if (!mapping) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-subscription-resource-bundle",
			resourceId: bundle,
			message: "Active Stripe subscription bundle was not found",
		});
	}

	const stripe = yield* stripeClientFx();
	const subscription = yield* Effect.promise(() => {
		return stripe.subscriptions.update(mapping.subscriptionId, {
			cancel_at_period_end: true,
		});
	});

	if (typeof subscription.customer === "string" && subscription.customer !== mapping.customerId) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-subscription-customer",
			resourceId: subscription.id,
			message: "Stripe subscription does not belong to the current customer",
		});
	}

	yield* subscriptionSyncFx({
		subscription: subscription.id,
		fallback: {
			bundleId: mapping.resourceBundleId,
			userId,
		},
	});

	const synced = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_resource_bundle as assignment")
			.select("assignment.expiresAt")
			.where("assignment.userId", "=", userId)
			.where("assignment.resourceBundleId", "=", mapping.resourceBundleId)
			.executeTakeFirst();
	});

	return {
		bundle,
		expiresAt: synced?.expiresAt ?? null,
		subscriptionId: subscription.id,
	};
});

export type subscriptionCancelFx = ReturnType<typeof subscriptionCancelFx>;
