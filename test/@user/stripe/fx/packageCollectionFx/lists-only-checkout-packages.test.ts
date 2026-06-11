import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { packageCollectionFx } from "~/user/stripe/server/fx/packageCollectionFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const liveIt = stripeSecret ? it : it.skip;

describe("packageCollectionFx", () => {
	liveIt("lists only checkout packages in stable checkout order", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-package-collection-checkout-packages");

		const packages = await Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});

			return yield* packageCollectionFx({
				userId: buyer.id,
			});
		}).pipe(
			withRuntimeFx(database),
			withStripeConfigFx({
				secret: stripeSecret,
				webhook: "whsec_test",
			}),
			Effect.runPromise,
		);

		expect(packages.map((bundle) => bundle.bundle)).toEqual([
			"package:buyer",
			"package:seller",
			"package:pro",
			"package:master",
		]);
		expect(packages.every((bundle) => bundle.interval === "month")).toBe(true);
		expect(packages.every((bundle) => bundle.active === null)).toBe(true);
	});
});
