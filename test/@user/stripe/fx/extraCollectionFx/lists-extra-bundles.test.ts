import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { extraCollectionFx } from "~/user/stripe/server/fx/extraCollectionFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const liveIt = stripeSecret ? it : it.skip;

describe("extraCollectionFx", () => {
	liveIt("lists only priced extra bundles in stable extra order", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-extra-collection-extra-bundles");

		const extras = await extraCollectionFx().pipe(
			withRuntimeFx(database),
			withStripeConfigFx({
				secret: stripeSecret,
				webhook: "whsec_test",
			}),
			Effect.runPromise,
		);

		expect(extras.map((bundle) => bundle.bundle)).toEqual([
			"extra:token:small",
			"extra:token:medium",
			"extra:token:large",
		]);
		expect(extras.every((bundle) => bundle.bundle.startsWith("extra:"))).toBe(true);
	});
});
