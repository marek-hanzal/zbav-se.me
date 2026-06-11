import { z } from "zod";

export const ResourceBundleTypeEnumSchema = z.enum([
	/**
	 * Shared catalog bundle backed by a recurring package.
	 *
	 * This type belongs to `package:*` resource bundle names from
	 * `ResourceBundleEnumSchema`. These bundles represent subscription/catalog
	 * packages shown in subscription/shop surfaces and reconciled from recurring
	 * Stripe subscriptions.
	 */
	"subscription",
	/**
	 * Shared catalog bundle for extras paid or activated outside subscriptions.
	 *
	 * This type belongs to `extra:*` resource bundle names from
	 * `ResourceBundleEnumSchema`. Extras are not recurring packages; they represent
	 * credits, one-time unlocks, coupons, or pass activations.
	 */
	"extra",
	/**
	 * Private per-user bundle created by the system for exactly one user.
	 *
	 * This type is created dynamically from auth/user bootstrap flows, typically
	 * through `resourceBundleEnsureFx`. It is intentionally not represented in
	 * `bundles.ts`, because it is not part of the shared product catalog and its
	 * name is user-specific.
	 */
	"user",
	/**
	 * Shared promotional bundle assigned by the system as a campaign or launch bonus.
	 *
	 * This type belongs to `welcome:*` resource bundle names from
	 * `ResourceBundleEnumSchema`. It is catalogued and seedable, but it is not a
	 * subscription product and it is not directly purchasable as an extra bundle.
	 */
	"promo",
]);

export type ResourceBundleTypeEnumSchema = typeof ResourceBundleTypeEnumSchema;

export namespace ResourceBundleTypeEnumSchema {
	export type Type = z.infer<ResourceBundleTypeEnumSchema>;
}
