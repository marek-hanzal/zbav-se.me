import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace priceFetchFx {
	export interface Props {
		lookupKey: string;
	}
}

/**
 * Fetches one active Stripe price by lookup key.
 *
 * Our catalog contract is intentionally small: resource_bundle.name maps to the
 * Stripe Price lookup key. Checkout only needs the fresh price ID, so this Fx does
 * not accept expanded Stripe objects, validate product parents, or decide whether
 * a caller needs a recurring or one-off price.
 *
 * Stripe SDK failures stay defects. A missing price is our domain-level mismatch
 * between configured Stripe product data and the checkout flow, so callers get a
 * typed NotFoundErrorFx.
 */
export const priceFetchFx = Effect.fn("priceFetchFx")(function* ({
	lookupKey,
}: priceFetchFx.Props) {
	const logger = yield* getLoggerFx("priceFetchFx");
	logger.trace("priceFetchFx", {
		lookupKey,
	});

	const stripe = yield* stripeClientFx();

	const prices = yield* Effect.promise(() => {
		return stripe.prices.list({
			active: true,
			lookup_keys: [
				lookupKey,
			],
			limit: 2,
		});
	});
	const [price] = prices.data;

	if (prices.data.length > 1) {
		return yield* new RuntimeErrorFx({
			message: "Stripe price lookup key is not unique",
			cause: {
				lookupKey,
				priceIds: prices.data.map((price) => price.id),
			},
		});
	}

	if (!price) {
		return yield* new NotFoundErrorFx({
			resource: "stripe-price",
			resourceId: lookupKey,
			message: "Stripe price was not found",
		});
	}

	return price;
});

export type priceFetchFx = ReturnType<typeof priceFetchFx>;
