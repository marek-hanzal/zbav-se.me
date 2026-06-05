import { Effect } from "effect";
import type { Stripe } from "stripe";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";

export namespace resolveUserFx {
	export interface Props {
		session: Stripe.Checkout.Session;
	}
}

/**
 * Resolves the local user ID carried by a Stripe Checkout Session.
 *
 * Checkout creation writes userId into client_reference_id and keeps metadata.userId
 * as a fallback. Missing user identity is a catalog/data mismatch, not a sync skip:
 * the session cannot be fulfilled without knowing which local user should receive
 * the purchased resources.
 */
export const resolveUserFx = Effect.fn("resolveUserFx")(function* ({
	session,
}: resolveUserFx.Props) {
	const logger = yield* getLoggerFx("resolveUserFx");
	logger.trace("resolveUserFx", {
		sessionId: session.id,
	});

	const userId = session.client_reference_id ?? session.metadata?.userId;

	if (!userId) {
		logger.warn("Cannot resolve userId from a Stripe checkout session", {
			sessionId: session.id,
		});

		return yield* new NotFoundErrorFx({
			resource: "stripe-checkout-session-user",
			resourceId: session.id,
			message: "Stripe checkout session user was not found",
		});
	}

	return userId;
});

export type resolveUserFx = ReturnType<typeof resolveUserFx>;
