import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
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

		const extraBundles = ResourceBundleEnumSchema.options.filter((bundle) => {
			return bundle.startsWith("extra:");
		});

		expect(extras.map((bundle) => bundle.bundle)).toEqual(extraBundles);
		expect(extras.every((bundle) => bundle.bundle.startsWith("extra:"))).toBe(true);
	});
	it("seeds every extra resource bundle as public", async () => {
		const database = await testabase("stripe-extra-collection-extra-access");
		const extraBundles = ResourceBundleEnumSchema.options.filter((bundle) => {
			return bundle.startsWith("extra:");
		});

		const rows = await database.kysely
			.selectFrom("resource_bundle")
			.select([
				"name",
				"access",
			])
			.where("name", "in", extraBundles)
			.orderBy("sort", "asc")
			.execute();

		expect(rows.map((row) => row.name)).toEqual(extraBundles);
		expect(rows.every((row) => row.access === "public")).toBe(true);
	});
});
