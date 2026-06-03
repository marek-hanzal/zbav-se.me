import { Effect } from "effect";
import Stripe from "stripe";
import { match, P } from "ts-pattern";
import { dbFx } from "~/server/database/fx/dbFx";
import { ServerStripeSchema } from "~/server/env/ServerStripeSchema";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";

export const bundleCollectionFx = Effect.fn("bundleCollectionFx")(function* () {
	const stripe = yield* Effect.sync(() => {
		const stripeConfig = ServerStripeSchema.parse(process.env);

		return new Stripe(stripeConfig.SERVER_STRIPE_SECRET);
	});
	const stripeBundles = yield* Effect.tryPromise({
		async try() {
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
		},
		catch(error) {
			return new RuntimeErrorFx({
				message: "Stripe bundle product list failed",
				cause: error,
			});
		},
	});

	if (stripeBundles.length === 0) {
		return [];
	}

	const names = [
		...new Set(stripeBundles.map((bundle) => bundle.bundle)),
	];
	const { resourceBundles, items, limits } = yield* dbFx(async (kysely) => {
		const resourceBundles = await kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("name", "in", names)
			.execute();

		if (resourceBundles.length === 0) {
			return {
				resourceBundles,
				items: [],
				limits: [],
			};
		}

		const ids = resourceBundles.map((bundle) => bundle.id);

		const [items, limits] = await Promise.all([
			kysely
				.selectFrom("resource_bundle_item")
				.select([
					"resourceBundleId",
					"resourceDefinitionId",
					"amount",
					"expiration",
				])
				.where("resourceBundleId", "in", ids)
				.execute(),
			kysely
				.selectFrom("resource_bundle_limit")
				.select([
					"resourceBundleId",
					"resourceDefinitionId",
					"limit",
				])
				.where("resourceBundleId", "in", ids)
				.execute(),
		]);

		return {
			resourceBundles,
			items,
			limits,
		};
	});
	const byName = new Map(
		resourceBundles.map((bundle) => [
			bundle.name,
			bundle,
		]),
	);
	const itemsById = Map.groupBy(items, (item) => item.resourceBundleId);
	const limitsById = Map.groupBy(limits, (limit) => limit.resourceBundleId);

	return stripeBundles.flatMap((stripeBundle) => {
		const resourceBundle = byName.get(stripeBundle.bundle);

		if (!resourceBundle) {
			return [];
		}

		return [
			{
				name: stripeBundle.name,
				price: stripeBundle.price,
				items: itemsById.get(resourceBundle.id) ?? [],
				limits: limitsById.get(resourceBundle.id) ?? [],
			},
		];
	});
});

export type bundleCollectionFx = ReturnType<typeof bundleCollectionFx>;
