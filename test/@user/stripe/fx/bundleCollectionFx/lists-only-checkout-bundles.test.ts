import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { bundleCollectionFx } from "~/user/stripe/server/fx/bundleCollectionFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const liveIt = stripeSecret ? it : it.skip;

describe("bundleCollectionFx", () => {
	liveIt("lists only checkout packages in stable checkout order", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-bundle-collection-checkout-bundles");

		const bundles = await bundleCollectionFx().pipe(
			withRuntimeFx(database),
			withStripeConfigFx({
				secret: stripeSecret,
				webhook: "whsec_test",
			}),
			Effect.runPromise,
		);

		expect(bundles.map((bundle) => bundle.bundle)).toEqual([
			"package:buyer",
			"package:seller",
			"package:pro",
			"package:master",
		]);
	});
});
