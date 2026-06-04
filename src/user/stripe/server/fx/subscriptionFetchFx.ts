import { Effect } from "effect";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { stripeClientFx } from "~/user/stripe/server/fx/stripeClientFx";

export namespace subscriptionFetchFx {
	export interface Props {
		id: string | Stripe.Subscription;
	}
}

/**
 * Resolves subscription from an existing provided subscription or do a fetch on Stripe side
 */
export const subscriptionFetchFx = Effect.fn("subscriptionFetchFx")(function* ({
	id,
}: subscriptionFetchFx.Props) {
	const stripe = yield* stripeClientFx();

	return yield* match(id)
		.with(P.string, (subscription) => {
			return Effect.tryPromise({
				try() {
					return stripe.subscriptions.retrieve(subscription);
				},
				catch(error) {
					return new RuntimeErrorFx({
						message: "Stripe subscription retrieval failed",
						cause: error,
					});
				},
			});
		})
		.with(
			{
				id: P.string,
			},
			(subscription) => {
				return Effect.succeed(subscription);
			},
		)
		.exhaustive();
});

export type subscriptionFetchFx = ReturnType<typeof subscriptionFetchFx>;
