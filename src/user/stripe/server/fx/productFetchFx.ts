import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace productFetchFx {
	export interface Props {
		bundle: string;
	}
}

/**
 * Resolves one active Stripe product for a local resource bundle.
 *
 * The local resource_bundle row is checked first so checkout cannot be started for
 * a bundle name unknown to our own catalog. Stripe SDK failures stay defects, while
 * catalog mismatches become explicit typed errors.
 */
export const productFetchFx = Effect.fn("productFetchFx")(function* ({
	bundle,
}: productFetchFx.Props) {
	const logger = yield* getLoggerFx("productFetchFx");
	logger.trace("productFetchFx", {
		bundle,
	});

	const resourceBundle = yield* dbFx((kysely) => {
		return kysely
			.selectFrom("resource_bundle")
			.select("id")
			.where("name", "=", bundle)
			.executeTakeFirst();
	});

	if (!resourceBundle) {
		return yield* new NotFoundErrorFx({
			resource: "resource-bundle",
			resourceId: bundle,
			message: "Resource bundle was not found",
		});
	}

	const stripe = yield* stripeClientFx();
	const products = yield* Effect.promise(() => {
		return stripe.products.search({
			query: `active:'true' AND metadata['bundle']:'${bundle}'`,
			limit: 100,
		});
	});
	const [product] = products.data;

	if (!product) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-product",
			resourceId: bundle,
			message: "Stripe product was not found",
		});
	}

	if (products.data.length > 1) {
		return yield* new RuntimeErrorFx({
			message: "Stripe product is not unique",
			cause: {
				bundle,
				productIds: products.data.map((product) => product.id),
			},
		});
	}

	return product;
});

export type productFetchFx = ReturnType<typeof productFetchFx>;
