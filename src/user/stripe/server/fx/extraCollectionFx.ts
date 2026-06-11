import { Effect } from "effect";
import { match, P } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import { stripeClientFx } from "~/user/stripe/server/fx/stripeClientFx";
import type { ExtraSchema } from "../schema/ExtraSchema";

export const extraCollectionFx = Effect.fn("extraCollectionFx")(function* () {
	const logger = yield* getLoggerFx("extraCollectionFx");
	logger.trace("extraCollectionFx");

	const stripe = yield* stripeClientFx();
	const {
		bundles: rawBundles,
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
					"sort",
				])
				.where("type", "=", "extra")
				.where("access", "=", "public")
				.orderBy("sort", "asc")
				.execute();

			if (bundles.length === 0) {
				return {
					bundles,
					items: [],
					limits: [],
					features: [],
				};
			}

			const ids = bundles.map((bundle) => bundle.id);

			const [items, limits, features] = await Promise.all([
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
				items,
				limits,
				features,
			};
		}),
	);

	const bundles = rawBundles.flatMap((bundle) => {
		const name = ResourceBundleEnumSchema.safeParse(bundle.name);

		if (!name.success) {
			return [];
		}

		return [
			{
				id: bundle.id,
				name: name.data,
				sort: bundle.sort,
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

		if (price.recurring) {
			logger.warn("Stripe extra price must not be recurring", {
				lookupKey: bundle.name,
				priceId: price.id,
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
			name: product.name,
			price: price.unit_amount,
			sort: bundle.sort,
		};
	});

	return products
		.flatMap(
			(
				product,
			): (ExtraSchema.Type & {
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
						bundle: bundle.name,
						currency: product.currency,
						description: product.description,
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

export type extraCollectionFx = ReturnType<typeof extraCollectionFx>;
