import { Effect } from "effect";
import { match, P } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import { stripeClientFx } from "~/user/stripe/server/fx/stripeClientFx";

export const bundleCollectionFx = Effect.fn("bundleCollectionFx")(function* () {
	const logger = yield* getLoggerFx("bundleCollectionFx");
	logger.trace("bundleCollectionFx");

	const stripe = yield* stripeClientFx();

	const { bundles, items, limits } = yield* dbFx(async (kysely) => {
		const bundles = await kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("name", "in", ResourceBundleEnumSchema.options)
			.execute();

		if (bundles.length === 0) {
			return {
				bundles,
				items: [],
				limits: [],
			};
		}

		const ids = bundles.map((bundle) => bundle.id);

		const [items, limits] = await Promise.all([
			kysely
				.selectFrom("resource_bundle_item")
				.select([
					"id",
					"resourceBundleId",
					"resourceDefinitionId",
					"amount",
					"expiration",
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
		]);

		return {
			bundles,
			items,
			limits,
		};
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

		const sort = Number(product.metadata.sort);

		return {
			bundle: bundle.name,
			id: bundle.id,
			name: product.name,
			price: price.unit_amount,
			sort: Number.isFinite(sort) ? sort : Number.POSITIVE_INFINITY,
		};
	});

	return products
		.flatMap((product) => {
			if (!product) {
				return [];
			}

			const bundle = byName.get(product.bundle);

			if (!bundle) {
				return [];
			}

			return [
				{
					id: bundle.id,
					bundle: bundle.name,
					name: product.name,
					price: product.price,
					sort: product.sort,
					items: itemsById.get(bundle.id) ?? [],
					limits: limitsById.get(bundle.id) ?? [],
				},
			];
		})
		.toSorted((left, right) => left.sort - right.sort);
});

export type bundleCollectionFx = ReturnType<typeof bundleCollectionFx>;
