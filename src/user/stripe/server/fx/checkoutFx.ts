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
	bundle: bundleName,
	locale,
	urlSuccess,
	urlCancel,
}: checkoutFx.Props) {
	const logger = yield* getLoggerFx("checkoutFx");
	logger.trace("checkoutFx", {
		userId,
		bundle: bundleName,
	});

	const bundle = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
				"type",
				"access",
			])
			.where("name", "=", bundleName)
			.executeTakeFirst();
	});

	if (!bundle) {
		return yield* new NotFoundErrorFx({
			resource: "resource_bundle",
			resourceId: bundleName,
			message: "Stripe checkout resource bundle is missing",
		});
	}

	if (bundle.access !== "public") {
		return yield* new RuntimeErrorFx({
			message: "Stripe checkout resource bundle is not publicly purchasable",
			cause: {
				bundle: bundle.name,
				access: bundle.access,
			},
		});
	}

	if (bundle.type !== "subscription" && bundle.type !== "extra") {
		return yield* new NotFoundErrorFx({
			resource: "resource_bundle",
			resourceId: bundleName,
			message: "Stripe checkout resource bundle is not purchasable",
		});
	}

	const stripe = yield* stripeClientFx();
	const customer = yield* ensureCustomerFx({
		userId,
	});
	const price = yield* priceFetchFx({
		lookupKey: bundleName,
	});
	const mode = bundle.type === "extra" ? "payment" : "subscription";
	const bundleKey = `stripe:checkout:${genId()}`;

	/*
	 * Keep our local identifiers on every Stripe object created by Checkout.
	 * Webhooks are just pings; sync refetches current Stripe state and uses this
	 * metadata to resolve the local resource bundle without guessing through products.
	 */
	const metadata = {
		userId,
		customerId: customer.customerId,
		resourceBundleId: bundle.id,
		bundle: bundle.name,
		priceId: price.id,
		bundleKey,
	};
	const successUrl = urlSuccess();
	const commonParams = {
		customer: customer.customerId,
		client_reference_id: userId,
		locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
		metadata,
		line_items: [
			{
				price: price.id,
				quantity: 1,
			},
		],
		success_url: `${successUrl}${successUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: urlCancel(),
	} satisfies Omit<Stripe.Checkout.SessionCreateParams, "mode">;

	const session = yield* Effect.promise(() => {
		if (mode === "payment") {
			return stripe.checkout.sessions.create({
				...commonParams,
				mode,
				payment_intent_data: {
					metadata,
				},
			});
		}

		return stripe.checkout.sessions.create({
			...commonParams,
			mode,
			subscription_data: {
				metadata,
			},
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
