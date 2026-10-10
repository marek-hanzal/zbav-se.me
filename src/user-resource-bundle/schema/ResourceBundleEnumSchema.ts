import { z } from "zod";

const PackageEnumSchema = z.enum([
	/**
	 * Default for free users; every user must have this package or they'll be basically
	 * unable to use the app.
	 */
	"package:free",
	/**
	 * Buyer optimized stuff
	 */
	"package:buyer",
	/**
	 * Seller optimized stuff
	 */
	"package:seller",
	/**
	 * Combines both buyer/seller with some little bonus
	 */
	"package:pro",
	/**
	 * Master package is highest level, mostly sold as a support for this application:
	 * There is a boost, but the price is more like "I like to support you" than the actual value
	 */
	"package:master",
]);

const WelcomeEnumSchema = z.enum([
	/**
	 * New registrations will get this welcome promo with limited time.
	 */
	"welcome:default",
	/**
	 * Initial wave get both founders packages, this one is life-time bonus
	 */
	"welcome:founders",
	/**
	 * Extra: Initial founders wave when the app launches: they've some extra bonuses.
	 *
	 * This package has some features, but it lasts only for a limited time.
	 */
	"welcome:founders:promo",
]);

const ExtraEnumSchema = z.enum([
	"extra:token:small",
	"extra:token:medium",
	"extra:token:large",
	//
	"extra:mark",
	"extra:top",
	"extra:top-maxxi",
	//
	"extra:brand",
	"extra:early-delivery",
	"extra:extra-listings",
]);

export const ResourceBundleEnumSchema = z.enum([
	...PackageEnumSchema.options,
	...WelcomeEnumSchema.options,
	...ExtraEnumSchema.options,
]);

export type ResourceBundleEnumSchema = typeof ResourceBundleEnumSchema;

export namespace ResourceBundleEnumSchema {
	export type Type = z.infer<ResourceBundleEnumSchema>;
}
