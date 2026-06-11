import { z } from "zod";

export const ResourceBundleTypeEnumSchema = z.enum([
	/**
	 * Shared catalog bundle backed by a recurring subscription-like package.
	 *
	 * This type belongs to `package:*` resource bundle names from
	 * `ResourceBundleEnumSchema`. The bundle is part of the public product catalog
	 * and can be shown in subscription/shop surfaces.
	 */
	"subscription",
	/**
	 * Shared catalog bundle paid or activated as a single purchase.
	 *
	 * This type belongs to `extra:*` resource bundle names from
	 * `ResourceBundleEnumSchema`. It is not a recurring package; it represents
	 * credits, one-time unlocks, coupons, or pass activations.
	 */
	"one-off",
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
	 * subscription product and it is not directly purchasable as a one-off bundle.
	 */
	"promo",
]);

export type ResourceBundleTypeEnumSchema = typeof ResourceBundleTypeEnumSchema;

export namespace ResourceBundleTypeEnumSchema {
	export type Type = z.infer<ResourceBundleTypeEnumSchema>;
}
