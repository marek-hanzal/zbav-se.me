import { Effect } from "effect";
import type Stripe from "stripe";
import { NotFoundErrorFx } from "@/lib/common/error";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
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
	const customer = yield* ensureCustomerFx({
		userId,
	});

	const resourceBundle = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("name", "=", bundle)
			.executeTakeFirst();
	});

	if (!resourceBundle) {
		return yield* new NotFoundErrorFx({
			resource: "resource_bundle",
			resourceId: bundle,
			message: "Stripe checkout resource bundle is missing",
		});
	}

	const price = yield* priceFetchFx({
		lookupKey: bundle,
	});
	const bundleKey = `stripe:checkout:${genId()}`;

	/*
	 * Keep our local identifiers on the Stripe objects created by Checkout.
	 *
	 * Webhooks only tell us that something changed, while sync reads the current
	 * Stripe objects. Writing the user/bundle IDs here lets later sync runs resolve
	 * local state directly from Session/Subscription metadata instead of jumping
	 * through price/product parents only to rediscover our own catalog mapping.
	 */
	const metadata = {
		userId,
		customerId: customer.customerId,
		resourceBundleId: resourceBundle.id,
		bundle: resourceBundle.name,
		priceId: price.id,
		bundleKey,
	};

	const session = yield* Effect.promise(() => {
		return stripe.checkout.sessions.create({
			mode: "subscription",
			customer: customer.customerId,
			client_reference_id: userId,
			locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
			metadata,
			subscription_data: {
				metadata,
			},
			line_items: [
				{
					price: price.id,
					quantity: 1,
				},
			],
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
