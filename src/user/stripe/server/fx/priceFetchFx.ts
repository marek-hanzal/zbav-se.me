import { Effect } from "effect";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { stripeClientFx } from "./stripeClientFx";

export namespace priceFetchFx {
	export interface Props {
		productId: string;
		priceId: string | Stripe.Price;
	}
}

/**
 * Fetches one active recurring Stripe price for the given product.
 *
 * Stripe can expose linked objects either as a plain ID or as an expanded object.
 * This Fx accepts both shapes and then refetches current Stripe data before handing
 * the price to callers.
 *
 * Stripe SDK failures stay defects. A missing price is our domain-level mismatch
 * between configured Stripe product data and the checkout flow, so callers get a
 * typed NotFoundErrorFx.
 */
export const priceFetchFx = Effect.fn("priceFetchFx")(function* ({
	productId,
	priceId,
}: priceFetchFx.Props) {
	const resolvedPriceId = match(priceId)
		.with(P.string, (priceId) => priceId)
		.with(
			{
				id: P.string,
			},
			(price) => price.id,
		)
		.exhaustive();

	const logger = yield* getLoggerFx("priceFetchFx");
	logger.trace("priceFetchFx", {
		productId,
		priceId: resolvedPriceId,
	});

	const stripe = yield* stripeClientFx();
	const prices = yield* Effect.promise(() => {
		return stripe.prices.search({
			query: `active:'true' AND type:'recurring' AND product:'${productId}'`,
			limit: 100,
		});
	});
	const price = prices.data.find((price) => price.id === resolvedPriceId);

	if (!price) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-price",
			resourceId: resolvedPriceId,
			message: "Stripe price was not found",
		});
	}

	return price;
});

export type priceFetchFx = ReturnType<typeof priceFetchFx>;
