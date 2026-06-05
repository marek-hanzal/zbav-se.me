import { Effect } from "effect";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { stripeClientFx } from "~/user/stripe/server/fx/stripeClientFx";

export namespace subscriptionFetchFx {
	export interface Props {
		id: string;
	}
}

/**
 * Fetches the current Stripe subscription object.
 *
 * Webhook payloads are intentionally not accepted here. The whole sync design depends
 * on Stripe API being the source of truth, so callers pass only the subscription ID.
 */
export const subscriptionFetchFx = Effect.fn("subscriptionFetchFx")(function* ({
	id,
}: subscriptionFetchFx.Props) {
	const stripe = yield* stripeClientFx();

	return yield* Effect.tryPromise({
		try() {
			return stripe.subscriptions.retrieve(id);
		},
		catch(error) {
			return new RuntimeErrorFx({
				message: "Stripe subscription retrieval failed",
				cause: error,
			});
		},
	});
});

export type subscriptionFetchFx = ReturnType<typeof subscriptionFetchFx>;
