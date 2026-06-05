import { Effect } from "effect";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { stripeClientFx } from "./stripeClientFx";

export namespace productFetchFx {
	export type Query =
		| {
				bundle: string;
		  }
		| {
				productId: string | Stripe.Product | Stripe.DeletedProduct;
		  };

	export interface Props {
		query: Query;
	}
}

export const productFetchFx = Effect.fn("productFetchFx")(function* (props: productFetchFx.Props) {
	const stripe = yield* stripeClientFx();

	return yield* match(props)
		.with(
			{
				query: {
					productId: P.string,
				},
			},
			(props) => {
				return Effect.promise(() => {
					return stripe.products.retrieve(props.query.productId);
				});
			},
		)
		.with(
			{
				query: {
					productId: {
						id: P.string,
					},
				},
			},
			(props) => {
				return Effect.promise(() => {
					return stripe.products.retrieve(props.query.productId.id);
				});
			},
		)
		.with(
			{
				query: {
					bundle: P.string,
				},
			},
			(props) => {
				return Effect.promise(() => {
                    /**
                     * TODO: We've to use search to get product by a bundle
                     */
					return stripe.products.retrieve(props.query.bundle);
				});
			},
		)
		.exhaustive();
});

export type productFetchFx = ReturnType<typeof productFetchFx>;
