import { Effect } from "effect";
import type Stripe from "stripe";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import type { BillingCheckoutCreateSchema } from "../schema/BillingCheckoutCreateSchema";
import { ensureCustomerFx } from "./ensureCustomerFx";
import { priceFetchFx } from "./priceFetchFx";
import { productFetchFx } from "./productFetchFx";
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
	productId,
	locale,
	urlSuccess,
	urlCancel,
}: checkoutFx.Props) {
	const logger = yield* getLoggerFx("checkoutFx");
	logger.trace("checkoutFx", {
		userId,
		productId,
	});

	const stripe = yield* stripeClientFx();
	const customer = yield* ensureCustomerFx({
		userId,
	});

	const product = yield* productFetchFx({
		product: productId,
	});

	if (!product.default_price) {
		return yield* new InvalidRequestErrorFx({
			message: "Stripe price is missing",
		});
	}

	const price = yield* priceFetchFx({
		productId: product.id,
		priceId: product.default_price,
	});

	const metadata = {
		userId,
		bundle,
	} as const;

	const session = yield* Effect.promise(() => {
		return stripe.checkout.sessions.create({
			mode: "subscription",
			customer: customer.customerId,
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
