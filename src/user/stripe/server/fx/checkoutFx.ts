import { Effect } from "effect";
import type Stripe from "stripe";
import { match, P } from "ts-pattern";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import type { BillingCheckoutCreateSchema } from "../schema/BillingCheckoutCreateSchema";
import { ensureCustomerFx } from "./ensureCustomerFx";
import { priceFetchFx } from "./priceFetchFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace checkoutFx {
	export interface Props extends BillingCheckoutCreateSchema.Type {
		userId: string;
		urlSuccess(): string;
		urlCancel(): string;
	}
}

export const checkoutFx = Effect.fn("checkoutFx")(function* ({
	userId,
	bundle,
	locale,
	urlSuccess,
	urlCancel,
}: checkoutFx.Props) {
	const logger = yield* getLoggerFx("checkoutFx");
	logger.trace("checkoutFx", {
		userId,
		bundle,
	});

	const stripe = yield* stripeClientFx();
	const userStripe = yield* ensureCustomerFx({
		userId,
	});

	const products = yield* Effect.promise(() => {
		return stripe.products.search({
			query: `active:'true' AND metadata['bundle']:'${bundle}'`,
			limit: 100,
		});
	});

	const [product] = products.data;

	if (!product) {
		return yield* new InvalidRequestErrorFx({
			message: "Stripe product is missing",
		});
	}

	if (products.data.length > 1) {
		return yield* new InvalidRequestErrorFx({
			message: "Stripe product is not unique",
		});
	}

	const defaultPriceId = match(product.default_price)
		.with(P.string, (price) => price)
		.with(
			{
				id: P.string,
			},
			(price) => price.id,
		)
		.otherwise(() => null);

	if (!defaultPriceId) {
		return yield* new InvalidRequestErrorFx({
			message: "Stripe price is missing",
		});
	}

	const price = yield* priceFetchFx({
		productId: product.id,
		priceId: defaultPriceId,
	});

	const metadata = {
		userId,
		bundle,
	} as const;

	const session = yield* Effect.promise(() => {
		return stripe.checkout.sessions.create({
			mode: "subscription",
			customer: userStripe.customerId,
			client_reference_id: userId,
			locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
			line_items: [
				{
					price: price.id,
					quantity: 1,
				},
			],
			metadata,
			subscription_data: {
				metadata,
			},
			success_url: urlSuccess(),
			cancel_url: urlCancel(),
		});
	});

	if (!session.url) {
		return yield* new RuntimeErrorFx({
			message: "Stripe checkout session URL is missing",
			cause: {
				sessionId: session.id,
				requestId: genId(),
			},
		});
	}

	return {
		url: session.url,
	} as const;
});

export type checkoutFx = ReturnType<typeof checkoutFx>;
