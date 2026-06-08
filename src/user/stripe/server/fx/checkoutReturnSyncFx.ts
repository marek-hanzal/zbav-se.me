import { Effect } from "effect";
import type { Stripe } from "stripe";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { AccessDeniedErrorFx } from "~/server/error/AccessDeniedErrorFx";
import { ensureCustomerFx } from "./ensureCustomerFx";
import { sessionFetchFx } from "./sessionFetchFx";
import { sessionSyncFx } from "./sync/sessionSyncFx";
import { syncFx } from "./sync/syncFx";

export namespace checkoutReturnSyncFx {
	export interface Props {
		userId: string;
		/** Checkout Session returned by Stripe through the success URL placeholder. */
		sessionId?: string;
	}
}

const customerIdOf = (customer: Stripe.Checkout.Session["customer"]) => {
	return typeof customer === "string" ? customer : (customer?.id ?? null);
};

/**
 * Reconciles Stripe state after a browser returns from Checkout.
 *
 * Webhooks stay the main async path, but the success redirect is a useful safety
 * net for local E2E and for users landing back before Stripe webhook delivery.
 */
export const checkoutReturnSyncFx = Effect.fn("checkoutReturnSyncFx")(function* ({
	userId,
	sessionId,
}: checkoutReturnSyncFx.Props) {
	const logger = yield* getLoggerFx("checkoutReturnSyncFx");
	logger.trace("checkoutReturnSyncFx", {
		userId,
		sessionId,
	});

	const customer = yield* ensureCustomerFx({
		userId,
	});
	const date = yield* DateServiceFx;

	if (!sessionId) {
		yield* syncFx({
			customerId: customer.customerId,
		});

		return customer;
	}

	const session = yield* sessionFetchFx({
		id: sessionId,
	});

	if (customerIdOf(session.customer) !== customer.customerId) {
		return yield* new AccessDeniedErrorFx({
			message: "Stripe checkout session does not belong to the current user",
		});
	}

	yield* sessionSyncFx({
		id: session.id,
		expiresAt: date.now().toJSDate(),
	});

	return customer;
});

export type checkoutReturnSyncFx = ReturnType<typeof checkoutReturnSyncFx>;
