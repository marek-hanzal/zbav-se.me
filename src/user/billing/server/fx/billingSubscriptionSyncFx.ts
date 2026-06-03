import { Effect } from "effect";
import type Stripe from "stripe";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import {
	BillingStripeBundleResourceBundle,
	BillingStripeBundleSchema,
} from "../schema/BillingStripeBundleSchema";

type StripeSubscriptionStatus = Stripe.Subscription.Status;

interface SubscriptionPeriodFields {
	cancel_at?: number | null;
	current_period_end?: number | null;
}

interface SubscriptionItemPeriodFields {
	current_period_end?: number | null;
}

interface SubscriptionSyncData {
	subscription: Stripe.Subscription;
	status: StripeSubscriptionStatus;
	customerId: string;
	subscriptionId: string;
	resourceBundleName: string | null;
	periodEnd: Date | null;
}

const ACTIVE_SUBSCRIPTION_STATUSES: StripeSubscriptionStatus[] = [
	"active",
	"trialing",
];

const toCustomerId = (customer: Stripe.Subscription["customer"]) => {
	return typeof customer === "string" ? customer : customer.id;
};

const toPeriodEnd = (subscription: Stripe.Subscription) => {
	const periodFields = subscription as SubscriptionPeriodFields;
	const itemPeriodEnd = subscription.items.data
		.map((item) => (item as SubscriptionItemPeriodFields).current_period_end)
		.find((periodEnd) => Boolean(periodEnd));
	const periodEnd = periodFields.current_period_end ?? itemPeriodEnd ?? periodFields.cancel_at;

	if (!periodEnd) {
		return null;
	}

	return new Date(periodEnd * 1000);
};

const toStripeBundle = (subscription: Stripe.Subscription) => {
	if (subscription.metadata.bundle) {
		return subscription.metadata.bundle;
	}

	return (
		subscription.items.data
			.map((item) => item.price.metadata.bundle)
			.find((bundle): bundle is string => Boolean(bundle)) ?? null
	);
};

const toResourceBundleName = (bundle: string | null) => {
	if (!bundle) {
		return null;
	}

	const legacyBundle = BillingStripeBundleSchema.safeParse(bundle);

	if (legacyBundle.success) {
		return BillingStripeBundleResourceBundle[legacyBundle.data];
	}

	return bundle;
};

const toSubscriptionSyncData = (subscription: Stripe.Subscription): SubscriptionSyncData => {
	const stripeBundle = toStripeBundle(subscription);

	return {
		subscription,
		status: subscription.status,
		customerId: toCustomerId(subscription.customer),
		subscriptionId: subscription.id,
		resourceBundleName: toResourceBundleName(stripeBundle),
		periodEnd: toPeriodEnd(subscription),
	};
};

export namespace billingSubscriptionSyncFx {
	export interface Props {
		subscription: Stripe.Subscription;
	}
}

export const billingSubscriptionSyncFx = Effect.fn("billingSubscriptionSyncFx")(function* ({
	subscription,
}: billingSubscriptionSyncFx.Props) {
	const logger = yield* getLoggerFx("billingSubscriptionSyncFx");
	logger.trace("billingSubscriptionSyncFx", {
		subscriptionId: subscription.id,
	});

	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();
	const syncData = toSubscriptionSyncData(subscription);

	if (!syncData.resourceBundleName) {
		return {
			synced: false,
		};
	}

	const bundle = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("name", "=", syncData.resourceBundleName)
			.executeTakeFirst();
	});

	if (!bundle) {
		return {
			synced: false,
		};
	}

	const userStripe = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_stripe")
			.select([
				"userId",
			])
			.where("customerId", "=", syncData.customerId)
			.executeTakeFirst();
	});

	if (!userStripe) {
		return {
			synced: false,
		};
	}

	const isActive = ACTIVE_SUBSCRIPTION_STATUSES.includes(syncData.status);
	const expiresAt = isActive
		? syncData.subscription.cancel_at_period_end
			? syncData.periodEnd
			: null
		: syncData.periodEnd && syncData.periodEnd < now
			? syncData.periodEnd
			: now;

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
				subscriptionId: syncData.subscriptionId,
				createdAt: now,
			})
			.onConflict((oc) => {
				return oc.column("userResourceBundleId").doUpdateSet({
					subscriptionId: syncData.subscriptionId,
				});
			})
			.execute();
	});

	return {
		synced: true,
	};
});

export type billingSubscriptionSyncFx = ReturnType<typeof billingSubscriptionSyncFx>;
