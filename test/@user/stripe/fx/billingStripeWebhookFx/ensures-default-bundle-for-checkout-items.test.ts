import { Effect } from "effect";
import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { withStripConfigEnv } from "~/user/stripe/server/env/withStripConfigEnv";
import { billingStripeWebhookFx } from "~/user/stripe/server/fx/billingStripeWebhookFx";

const toCheckoutItemEvent = (eventId: string, userId: string): Stripe.Event =>
	({
		id: eventId,
		type: "checkout.session.completed",
		data: {
			object: {
				id: "cs_checkout_item_buyer",
				client_reference_id: userId,
				metadata: {
					userId,
				},
				subscription: null,
				line_items: {
					data: [
						{
							id: "li_token_150",
							metadata: {
								bundle: "package:buyer",
							},
							price: {
								id: "price_token_150",
								metadata: {
									bundle: "package:buyer",
								},
								product: "prod_token_150",
							},
						},
					],
				},
			},
		},
	}) as unknown as Stripe.Event;

describe("billingStripeWebhookFx checkout items", () => {
	it("ensures the default user bundle for checkout item bundles", async () => {
		const database = await testabase("billing-stripe-webhook-checkout-item");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const event = toCheckoutItemEvent(`evt_${genId()}`, buyer.id);

			const result = yield* billingStripeWebhookFx({
				event,
			});

			const defaultBundle = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select([
						"rb.name",
						"urb.expiresAt",
					])
					.where("urb.userId", "=", buyer.id)
					.where("rb.name", "=", buyer.id)
					.executeTakeFirst();
			});
			const bundleItem = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle as rb")
					.innerJoin("resource_bundle_item as rbi", "rbi.resourceBundleId", "rb.id")
					.select([
						"rb.name",
						"rbi.resourceDefinitionId",
						"rbi.amount",
						"rbi.expiration",
					])
					.where("rb.name", "=", "package:buyer")
					.where("rbi.resourceDefinitionId", "=", "item:token-150")
					.executeTakeFirst();
			});

			expect(result.processed).toBe(true);
			expect(bundleItem).toEqual({
				name: "package:buyer",
				resourceDefinitionId: "item:token-150",
				amount: "1.00",
				expiration: null,
			});
			expect(defaultBundle).toEqual({
				name: buyer.id,
				expiresAt: null,
			});
		}).pipe(
			withRuntimeFx(database),
			withStripeConfigFx(withStripConfigEnv()),
			Effect.runPromise,
		);
	});
});
