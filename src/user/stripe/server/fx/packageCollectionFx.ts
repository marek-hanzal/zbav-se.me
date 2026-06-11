import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import type { PackageActiveSchema, PackageSchema } from "../schema/PackageSchema";
import { catalogFx } from "./catalogFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace packageCollectionFx {
	export interface Props {
		userId: string;
	}
}

export const packageCollectionFx = Effect.fn("packageCollectionFx")(function* ({
	userId,
}: packageCollectionFx.Props) {
	const logger = yield* getLoggerFx("packageCollectionFx");
	logger.trace("packageCollectionFx", {
		userId,
	});

	const date = yield* DateServiceFx;
	const now = date.now().toJSDate();
	const bundles = yield* catalogFx({
		type: "subscription",
		priceMode: "recurring",
	});

	if (bundles.length === 0) {
		return [];
	}

	const activeAssignments = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_resource_bundle as assignment")
			.leftJoin(
				"user_resource_bundle_stripe as stripeLink",
				"stripeLink.userResourceBundleId",
				"assignment.id",
			)
			.select([
				"assignment.expiresAt",
				"assignment.resourceBundleId",
				"stripeLink.subscriptionId",
			])
			.where("assignment.userId", "=", userId)
			.where(
				"assignment.resourceBundleId",
				"in",
				bundles.map((bundle) => bundle.id),
			)
			.where("assignment.availableAt", "<=", now)
			.where((eb) =>
				eb.or([
					eb("assignment.expiresAt", "is", null),
					eb("assignment.expiresAt", ">", now),
				]),
			)
			.execute();
	});
	const subscriptionIds = activeAssignments
		.map((assignment) => assignment.subscriptionId)
		.filter((subscriptionId): subscriptionId is string => Boolean(subscriptionId));
	const subscriptionsById = subscriptionIds.length
		? new Map(
				yield* Effect.gen(function* () {
					const stripe = yield* stripeClientFx();

					return yield* Effect.promise(async () => {
						const entries = await Promise.all(
							subscriptionIds.map(async (subscriptionId) => {
								const subscription =
									await stripe.subscriptions.retrieve(subscriptionId);

								return [
									subscription.id,
									subscription,
								] as const;
							}),
						);

						return entries;
					});
				}),
			)
		: new Map();
	const activeByBundleId = new Map<string, PackageActiveSchema.Type>();

	for (const assignment of activeAssignments) {
		const subscription = assignment.subscriptionId
			? subscriptionsById.get(assignment.subscriptionId)
			: null;
		const itemEnd =
			subscription?.items.data.map((item) => item.current_period_end).find(Boolean) ??
			subscription?.cancel_at ??
			null;
		const currentPeriodEndAt = itemEnd ? date.ofSeconds(itemEnd).toJSDate() : null;
		const cancelAtPeriodEnd =
			subscription?.cancel_at_period_end ?? Boolean(assignment.expiresAt);

		activeByBundleId.set(assignment.resourceBundleId, {
			cancelAtPeriodEnd,
			periodEndAt: assignment.expiresAt ?? currentPeriodEndAt,
		});
	}

	return bundles.flatMap(({ id, interval, sort: _sort, ...bundle }): PackageSchema.Type[] => {
		if (!interval) {
			logger.warn("Stripe package catalog entry is missing recurring interval", {
				bundle: bundle.bundle,
			});

			return [];
		}

		return [
			{
				...bundle,
				active: activeByBundleId.get(id) ?? null,
				interval,
			},
		];
	});
});

export type packageCollectionFx = ReturnType<typeof packageCollectionFx>;
