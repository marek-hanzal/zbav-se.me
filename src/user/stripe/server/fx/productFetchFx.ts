import { Effect } from "effect";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { stripeClientFx } from "./stripeClientFx";

export namespace productFetchFx {
	export interface Props {
		productId: string | Stripe.Product | Stripe.DeletedProduct;
	}
}

export const productFetchFx = Effect.fn("productFetchFx")(function* ({
	productId,
}: productFetchFx.Props) {
	const stripe = yield* stripeClientFx();

	return yield* Effect.promise(() => {
		return stripe.products.retrieve(
			match(productId)
				.with(P.string, (id) => id)
				.with(
					{
						id: P.string,
					},
					(product) => product.id,
				)
				.exhaustive(),
		);
	});
});

export type productFetchFx = ReturnType<typeof productFetchFx>;
