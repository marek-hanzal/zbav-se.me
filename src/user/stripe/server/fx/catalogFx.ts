import { Effect } from "effect";
import { match, P } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ResourceBundleFeatureSchema } from "~/common/resource-bundle-feature/server/schema/ResourceBundleFeatureSchema";
import type { ResourceBundleItemSchema } from "~/common/resource-bundle-item/server/schema/ResourceBundleItemSchema";
import type { ResourceBundleLimitSchema } from "~/common/resource-bundle-limit/server/schema/ResourceBundleLimitSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import type { ResourceBundleTypeEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleTypeEnumSchema";
import { stripeClientFx } from "~/user/stripe/server/fx/stripeClientFx";

export namespace catalogFx {
	export type Type = Extract<ResourceBundleTypeEnumSchema.Type, "subscription" | "extra">;
	export type PriceMode = "recurring" | "one-time";

	export interface Props {
		type: Type;
		priceMode: PriceMode;
	}

	export interface Bundle {
		id: string;
		bundle: ResourceBundleEnumSchema.Type;
		name: string;
		description: string | null;
		price: number;
		currency: string;
		interval: string | null;
		items: Pick<ResourceBundleItemSchema.Type, "amount" | "id" | "resourceDefinitionId">[];
		limits: Pick<ResourceBundleLimitSchema.Type, "id" | "limit" | "resourceDefinitionId">[];
		features: Pick<ResourceBundleFeatureSchema.Type, "id" | "resourceDefinitionId">[];
		sort: number;
	}
}

/** Reads public checkoutable bundle templates and joins them with their Stripe price/product data. */
export const catalogFx = Effect.fn("catalogFx")(function* ({ type, priceMode }: catalogFx.Props) {
	const logger = yield* getLoggerFx("catalogFx");
	logger.trace("catalogFx", {
		type,
		priceMode,
	});

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
				.where("type", "=", type)
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

	return bundles
		.flatMap((bundle): catalogFx.Bundle[] => {
			const prices = pricesByLookupKey.get(bundle.name) ?? [];
			const [price] = prices;

			if (!price) {
				return [];
			}

			const amount = match(price.unit_amount)
				.with(P.number, (amount) => amount)
				.otherwise(() => null);

			if (amount === null) {
				return [];
			}

			if (prices.length > 1) {
				logger.warn("Stripe price lookup key is not unique", {
					lookupKey: bundle.name,
					priceIds: prices.map((price) => price.id),
				});

				return [];
			}

			const isRecurring = Boolean(price.recurring?.interval);

			if (priceMode === "recurring" && !isRecurring) {
				logger.warn("Stripe package price is not recurring", {
					lookupKey: bundle.name,
					priceId: price.id,
				});

				return [];
			}

			if (priceMode === "one-time" && price.recurring) {
				logger.warn("Stripe extra price must not be recurring", {
					lookupKey: bundle.name,
					priceId: price.id,
				});

				return [];
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
					(product) => product,
				)
				.otherwise(() => null);

			if (!product) {
				return [];
			}

			return [
				{
					id: bundle.id,
					bundle: bundle.name,
					currency: price.currency,
					description: product.description ?? null,
					interval: price.recurring?.interval ?? null,
					items: itemsById.get(bundle.id) ?? [],
					limits: limitsById.get(bundle.id) ?? [],
					features: featuresById.get(bundle.id) ?? [],
					name: product.name,
					price: amount,
					sort: bundle.sort,
				},
			];
		})
		.toSorted((left, right) => left.sort - right.sort);
});

export type catalogFx = ReturnType<typeof catalogFx>;
