import { z } from "zod";

export const AccessEnumSchema = z
	.enum([
		/**
		 * Publicly reachable or publicly selectable resource.
		 *
		 * For resource bundles this means the bundle is part of the normal shop/catalog
		 * surface and may be used by checkout. For files/galleries this means the asset
		 * can be exposed through public product surfaces.
		 */
		"public",
		/**
		 * Protected resource that is not directly selectable by regular users.
		 *
		 * Protected records can still be created, assigned, or consumed by trusted system
		 * flows. For resource bundles this covers welcome promos and user bootstrap
		 * bundles: users can receive them as a side effect, but cannot buy/select them
		 * directly in checkout.
		 */
		"protected",
		/**
		 * Private/internal resource that should not be offered by normal product flows.
		 *
		 * For resource bundles this is the hard off switch: keep the bundle definition in
		 * the database, but prevent regular selection and checkout entirely. Use explicit
		 * system code if a private record ever needs to be touched.
		 */
		"private",
	])
	.meta({
		id: "AccessEnum",
		description: "Visibility/accessibility of a resource",
	});

export type AccessEnumSchema = typeof AccessEnumSchema;

export namespace AccessEnumSchema {
	export type Type = z.infer<AccessEnumSchema>;
}
