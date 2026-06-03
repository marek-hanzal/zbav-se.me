import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import type { BillingCheckoutCreateSchema } from "../schema/BillingCheckoutCreateSchema";
import { billingCustomerEnsureFx } from "./billingCustomerEnsureFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace billingCheckoutCreateFx {
	export interface Props extends BillingCheckoutCreateSchema.Type {
		userId: string;
		urlSuccess(): string;
		urlCancel(): string;
	}
}

export const billingCheckoutCreateFx = Effect.fn("billingCheckoutCreateFx")(function* ({
	userId,
	bundle,
	urlSuccess,
	urlCancel,
}: billingCheckoutCreateFx.Props) {
	const logger = yield* getLoggerFx("billingCheckoutCreateFx");
	logger.trace("billingCheckoutCreateFx", {
		userId,
		bundle,
	});

	const stripe = yield* stripeClientFx();
	const userStripe = yield* billingCustomerEnsureFx({
		userId,
	});
	const prices = yield* Effect.tryPromise({
		try() {
			return stripe.prices.search({
				query: `active:'true' AND type:'recurring' AND metadata['bundle']:'${bundle}'`,
				limit: 100,
			});
		},
		catch(error) {
			return new RuntimeErrorFx({
				message: "Stripe price search failed",
				cause: error,
			});
		},
	});
	const [price] = prices.data.toSorted((left, right) => right.created - left.created);

	if (!price) {
		return yield* new InvalidRequestErrorFx({
			message: "Stripe price is missing",
		});
	}

	const metadata = {
		userId,
		bundle,
	} as const;

	const session = yield* Effect.tryPromise({
		try() {
			return stripe.checkout.sessions.create({
				mode: "subscription",
				customer: userStripe.customerId,
				client_reference_id: userId,
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
		},
		catch(error) {
			return new RuntimeErrorFx({
				message: "Stripe checkout session creation failed",
				cause: error,
			});
		},
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

export type billingCheckoutCreateFx = ReturnType<typeof billingCheckoutCreateFx>;
