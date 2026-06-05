import { Effect } from "effect";
import { match, P } from "ts-pattern";
import { dbFx } from "~/server/database/fx/dbFx";
import { stripeClientFx } from "~/user/stripe/server/fx/stripeClientFx";

export const bundleCollectionFx = Effect.fn("bundleCollectionFx")(function* () {
	const stripe = yield* stripeClientFx();

	const products = yield* Effect.promise(async () => {
		const products = await stripe.products.search({
			/*
			 * Stripe search can lag behind writes; bundle products are configured upfront,
			 * and DB remains the delivery source of truth.
			 */
			query: "active:'true' AND -metadata['bundle']:null",
			expand: [
				"data.default_price",
			],
			limit: 100,
		});

		return products.data
			.flatMap((product) =>
				match({
					bundle: product.metadata.bundle,
					price: product.default_price,
				})
					.with(
						{
							bundle: P.string,
							price: {
								unit_amount: P.number,
							},
						},
						({ bundle, price }) => {
							const sort = Number(product.metadata.sort);
							const stripeBundle = {
								bundle,
								name: product.name,
								price: price.unit_amount,
								sort: Number.POSITIVE_INFINITY,
							};

							if (Number.isFinite(sort)) {
								stripeBundle.sort = sort;
							}

							return [
								stripeBundle,
							];
						},
					)
					.otherwise(() => []),
			)
			.filter((bundle) => bundle.bundle.length > 0)
			.toSorted((left, right) => left.sort - right.sort);
	});

	if (products.length === 0) {
		return [];
	}

	const names = [
		...new Set(products.map((bundle) => bundle.bundle)),
	];
	const { bundles, items, limits } = yield* dbFx(async (kysely) => {
		const bundles = await kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("name", "in", names)
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
	const byName = new Map(
		bundles.map((bundle) => [
			bundle.name,
			bundle,
		]),
	);
	const itemsById = Map.groupBy(items, (item) => item.resourceBundleId);
	const limitsById = Map.groupBy(limits, (limit) => limit.resourceBundleId);

	return products.flatMap((stripeBundle) => {
		const bundle = byName.get(stripeBundle.bundle);

		if (!bundle) {
			return [];
		}

		return [
			{
				id: bundle.id,
				bundle: bundle.name,
				name: stripeBundle.name,
				price: stripeBundle.price,
				items: itemsById.get(bundle.id) ?? [],
				limits: limitsById.get(bundle.id) ?? [],
			},
		];
	});
});

export type bundleCollectionFx = ReturnType<typeof bundleCollectionFx>;
