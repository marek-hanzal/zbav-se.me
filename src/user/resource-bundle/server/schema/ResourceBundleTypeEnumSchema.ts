import { z } from "zod";

export const ResourceBundleTypeEnumSchema = z.enum([
	/**
	 * Shared catalog bundle defining a package of resource grants.
	 *
	 * This type belongs to `package:*` resource bundle names from
	 * `ResourceBundleEnumSchema`. System assignment flows copy their items,
	 * limits, and features into per-user snapshots.
	 */
	"package",
	/**
	 * Shared catalog bundle for individual resource additions.
	 *
	 * This type belongs to `extra:*` resource bundle names from
	 * `ResourceBundleEnumSchema`. Extras represent credits, one-time unlocks,
	 * coupons, or pass activations assigned by system flows.
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
	 * `ResourceBundleEnumSchema`. It is catalogued and seedable and is assigned
	 * by campaign or user bootstrap flows.
	 */
	"promo",
]);

export type ResourceBundleTypeEnumSchema = typeof ResourceBundleTypeEnumSchema;

export namespace ResourceBundleTypeEnumSchema {
	export type Type = z.infer<ResourceBundleTypeEnumSchema>;
}
