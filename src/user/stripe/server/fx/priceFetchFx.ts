import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { stripeClientFx } from "./stripeClientFx";

export namespace priceFetchFx {
	export interface Props {
		productId: string;
		priceId: string;
	}
}

/**
 * Fetches one active recurring Stripe price for the given product.
 *
 * Stripe SDK failures stay defects. A missing price is our domain-level mismatch
 * between configured Stripe product data and the checkout flow, so callers get a
 * typed NotFoundErrorFx.
 */
export const priceFetchFx = Effect.fn("priceFetchFx")(function* ({
	productId,
	priceId,
}: priceFetchFx.Props) {
	const logger = yield* getLoggerFx("priceFetchFx");
	logger.trace("priceFetchFx", {
		productId,
		priceId,
	});

	const stripe = yield* stripeClientFx();
	const prices = yield* Effect.promise(() => {
		return stripe.prices.search({
			query: `active:'true' AND type:'recurring' AND product:'${productId}'`,
			limit: 100,
		});
	});
	const price = prices.data.find((price) => price.id === priceId);

	if (!price) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-price",
			resourceId: priceId,
			message: "Stripe price was not found",
		});
	}

	return price;
});

export type priceFetchFx = ReturnType<typeof priceFetchFx>;
