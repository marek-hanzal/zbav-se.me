import { Effect } from "effect";
import { match, P } from "ts-pattern";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { stripeClientFx } from "~/user/stripe/server/fx/stripeClientFx";
import { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";
import type { BundleActiveSchema, BundleSchema } from "../schema/BundleSchema";

export namespace bundleCollectionFx {
	export interface Props {
		userId: string;
	}
}

export const bundleCollectionFx = Effect.fn("bundleCollectionFx")(function* ({
	userId,
}: bundleCollectionFx.Props) {
	const logger = yield* getLoggerFx("bundleCollectionFx");
	logger.trace("bundleCollectionFx", {
		userId,
	});
	const date = yield* DateServiceFx;
	const now = date.now().toJSDate();

	const stripe = yield* stripeClientFx();
	const checkoutBundles = CheckoutBundleEnumSchema.options;
	const orderByName = new Map(
		checkoutBundles.map((bundle, index) => [
			bundle,
			index,
		]),
	);

	const {
		bundles: rawBundles,
		activeAssignments,
		items,
		limits,
		features,
	} = yield* withTransactionFx(
		dbFx(async (kysely) => {
			const bundles = await kysely
				.selectFrom("resource_bundle")
				.select([
					"id",
					"name",
				])
				.where("name", "in", checkoutBundles)
				.execute();

			if (bundles.length === 0) {
				return {
					bundles,
					activeAssignments: [],
					items: [],
					limits: [],
					features: [],
				};
			}

			const ids = bundles.map((bundle) => bundle.id);

			const [activeAssignments, items, limits, features] = await Promise.all([
				kysely
					.selectFrom("user_resource_bundle as assignment")
					.innerJoin(
						"resource_bundle as bundle",
						"bundle.id",
						"assignment.resourceBundleId",
					)
					.leftJoin(
						"user_resource_bundle_stripe as stripeLink",
						"stripeLink.userResourceBundleId",
						"assignment.id",
					)
					.select([
						"assignment.expiresAt",
						"bundle.name",
						"stripeLink.subscriptionId",
					])
					.where("assignment.userId", "=", userId)
					.where("bundle.name", "in", checkoutBundles)
					.where("assignment.availableAt", "<=", now)
					.where((eb) =>
						eb.or([
							eb("assignment.expiresAt", "is", null),
							eb("assignment.expiresAt", ">", now),
						]),
					)
					.execute(),
				kysely
					.selectFrom("resource_bundle_item")
					.select([
						"id",
						"resourceBundleId",
						"resourceDefinitionId",
						"amount",
					])
					.where("resourceBundleId", "in", ids)
					.where("amount", ">", 0)
					.execute(),
				kysely
					.selectFrom("resource_bundle_limit")
					.select([
						"id",
						"resourceBundleId",
						"resourceDefinitionId",
						"limit",
					])
					.where("resourceBundleId", "in", ids)
					.where("limit", ">", 0)
					.execute(),
				kysely
					.selectFrom("resource_bundle_feature")
					.select([
						"id",
						"resourceBundleId",
						"resourceDefinitionId",
					])
					.where("resourceBundleId", "in", ids)
					.execute(),
			]);

			return {
				bundles,
				activeAssignments,
				items,
				limits,
				features,
			};
		}),
	);

	const bundles = rawBundles.flatMap((bundle) => {
		const name = CheckoutBundleEnumSchema.safeParse(bundle.name);

		if (!name.success) {
			return [];
		}

		return [
			{
				id: bundle.id,
				name: name.data,
			},
		];
	});

	if (bundles.length === 0) {
		return [];
	}

	const byName = new Map(
		bundles.map((bundle) => [
			bundle.name,
			bundle,
		]),
	);
	const itemsById = Map.groupBy(items, (item) => item.resourceBundleId);
	const limitsById = Map.groupBy(limits, (limit) => limit.resourceBundleId);
	const featuresById = Map.groupBy(features, (feature) => feature.resourceBundleId);
	const activeRows = activeAssignments.flatMap((assignment) => {
		const name = CheckoutBundleEnumSchema.safeParse(assignment.name);

		if (!name.success) {
			return [];
		}

		return [
			{
				bundle: name.data,
				expiresAt: assignment.expiresAt,
				subscriptionId: assignment.subscriptionId ?? null,
			},
		];
	});
	const subscriptionsById = new Map(
		yield* Effect.promise(async () => {
			const entries = await Promise.all(
				activeRows
					.map((assignment) => assignment.subscriptionId)
					.filter((subscriptionId): subscriptionId is string => Boolean(subscriptionId))
					.map(async (subscriptionId) => {
						const subscription = await stripe.subscriptions.retrieve(subscriptionId);

						return [
							subscription.id,
							subscription,
						] as const;
					}),
			);

			return entries;
		}),
	);
	const activeByBundle = new Map<CheckoutBundleEnumSchema.Type, BundleActiveSchema.Type>();

	for (const assignment of activeRows) {
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

		activeByBundle.set(assignment.bundle, {
			cancelAtPeriodEnd,
			periodEndAt: assignment.expiresAt ?? currentPeriodEndAt,
		});
	}

	const prices = yield* Effect.promise(() => {
		return stripe.prices.list({
			active: true,
			lookup_keys: bundles.map((bundle) => bundle.name),
			expand: [
				"data.product",
			],
			limit: 100,
		});
	});
	const pricesByLookupKey = Map.groupBy(
		prices.data.filter((price) => price.lookup_key),
		(price) => price.lookup_key ?? "",
	);
	const products = bundles.map((bundle) => {
		const prices = pricesByLookupKey.get(bundle.name) ?? [];
		const [price] = prices;

		if (!price) {
			return null;
		}

		if (typeof price.unit_amount !== "number") {
			return null;
		}

		if (prices.length > 1) {
			logger.warn("Stripe price lookup key is not unique", {
				lookupKey: bundle.name,
				priceIds: prices.map((price) => price.id),
			});

			return null;
		}

		const product = match(price.product)
			.with(
				{
					deleted: true,
				},
				() => null,
			)
			.with(
				{
					description: P.any,
					id: P.string,
					metadata: P.any,
					name: P.string,
				},
				(product) => {
					return product;
				},
			)
			.otherwise(() => null);

		if (!product) {
			return null;
		}

		return {
			bundle: bundle.name,
			currency: price.currency,
			description: product.description ?? null,
			id: bundle.id,
			interval: price.recurring?.interval ?? null,
			name: product.name,
			price: price.unit_amount,
			sort: orderByName.get(bundle.name) ?? Number.POSITIVE_INFINITY,
		};
	});

	return products
		.flatMap(
			(
				product,
			): (BundleSchema.Type & {
				sort: number;
			})[] => {
				if (!product) {
					return [];
				}

				const bundle = byName.get(product.bundle);

				if (!bundle) {
					return [];
				}

				return [
					{
						active: activeByBundle.get(bundle.name) ?? null,
						bundle: bundle.name,
						currency: product.currency,
						description: product.description,
						interval: product.interval,
						name: product.name,
						price: product.price,
						sort: product.sort,
						items: itemsById.get(bundle.id) ?? [],
						limits: limitsById.get(bundle.id) ?? [],
						features: featuresById.get(bundle.id) ?? [],
					},
				];
			},
		)
		.toSorted((left, right) => left.sort - right.sort)
		.map(({ sort: _sort, ...bundle }) => bundle);
});

export type bundleCollectionFx = ReturnType<typeof bundleCollectionFx>;
