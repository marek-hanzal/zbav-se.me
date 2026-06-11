import type { AccessEnumSchema } from "~/common/access/AccessEnumSchema";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import type { ResourceBundleTypeEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleTypeEnumSchema";

export const bundles: Record<
	ResourceBundleEnumSchema.Type,
	{
		type: ResourceBundleTypeEnumSchema.Type;
		access: AccessEnumSchema.Type;
		sort: number;
		items: Partial<
			Record<
				ResourceDefinitionEnumSchema.Type,
				{
					amount: number;
				}
			>
		>;
		limits: Partial<
			Record<
				ResourceDefinitionEnumSchema.Type,
				{
					limit: number;
				}
			>
		>;
		features: Partial<Record<ResourceDefinitionEnumSchema.Type, {}>>;
	}
> = {
	/**
	 * Every user gets this package as the baseline fallback for limits and basic resources.
	 * Paid packages must override these limits explicitly where needed.
	 */
	"package:free": {
		type: "subscription",
		access: "protected",
		sort: 0,
		items: {
			"common:item:support": {
				amount: 1,
			},
			"common:item:agent.usage": {
				amount: 30,
			},
		},
		limits: {
			"buyer:limit:feed.count": {
				limit: 3,
			},
			"seller:limit:listing.count": {
				limit: 5,
			},
			"seller:limit:listing.gallery.count": {
				limit: 5,
			},
			"common:limit:agent.token": {
				limit: 5_000,
			},
			"common:limit:agent.handbrake": {
				limit: 200_000,
			},
		},
		features: {},
	},
	/**
	 * Buyer expansion package.
	 */
	"package:buyer": {
		type: "subscription",
		access: "public",
		sort: 10,
		items: {
			"common:item:support": {
				amount: 3,
			},
			"common:item:token": {
				amount: 150,
			},
			"common:item:agent.usage": {
				amount: 150,
			},
		},
		limits: {
			"buyer:limit:feed.count": {
				limit: 10,
			},
			"common:limit:agent.token": {
				limit: 10_000,
			},
			"common:limit:agent.handbrake": {
				limit: 1_500_000,
			},
		},
		features: {
			"buyer:feature:anti-topper": {},
			"buyer:feature:history": {},
			"buyer:feature:listing.early-discovery": {},
			"buyer:feature:seller.info": {},
		},
	},
	/**
	 * Seller expansion package
	 */
	"package:seller": {
		type: "subscription",
		access: "public",
		sort: 20,
		items: {
			"common:item:support": {
				amount: 3,
			},
			"seller:item:listing.early-delivery": {
				amount: 3,
			},
			"common:item:token": {
				amount: 150,
			},
			"common:item:agent.usage": {
				amount: 120,
			},
			"seller:item:listing.mark": {
				amount: 5,
			},
			"seller:item:listing.top": {
				amount: 3,
			},
			"seller:item:listing.top-maxxi": {
				amount: 1,
			},
		},
		limits: {
			"seller:limit:listing.count": {
				limit: 20,
			},
			"seller:limit:listing.gallery.count": {
				limit: 12,
			},
			"common:limit:agent.token": {
				limit: 10_000,
			},
			"common:limit:agent.handbrake": {
				limit: 1_500_000,
			},
		},
		features: {
			"seller:feature:buyer.info": {},
			"seller:feature:listing.info": {},
			"seller:feature:payback": {},
			"seller:feature:listing.longer-expiration": {},
		},
	},
	/**
	 * This should generally extend seller/buyer plan in the spirit of "I don't want to think about limits".
	 */
	"package:pro": {
		type: "subscription",
		access: "public",
		sort: 30,
		items: {
			"common:item:support": {
				amount: 5,
			},
			"common:item:token": {
				amount: 300,
			},
			"common:item:agent.usage": {
				amount: 300,
			},
			"seller:item:listing.early-delivery": {
				amount: 6,
			},
			"seller:item:listing.mark": {
				amount: 10,
			},
			"seller:item:listing.top": {
				amount: 6,
			},
			"seller:item:listing.top-maxxi": {
				amount: 3,
			},
		},
		limits: {
			"buyer:limit:feed.count": {
				limit: 20,
			},
			"seller:limit:listing.count": {
				limit: 40,
			},
			"seller:limit:listing.gallery.count": {
				limit: 20,
			},
			"common:limit:agent.token": {
				limit: 15_000,
			},
			"common:limit:agent.handbrake": {
				limit: 4_000_000,
			},
		},
		features: {
			"buyer:feature:anti-topper": {},
			"buyer:feature:history": {},
			"buyer:feature:listing.early-discovery": {},
			"buyer:feature:seller.info": {},
			"seller:feature:brand": {},
			"seller:feature:buyer.info": {},
			"seller:feature:listing.longer-expiration": {},
			"seller:feature:payback": {},
			"seller:feature:listing.info": {},
		},
	},
	/**
	 * Master is the best a user can buy - pricy, but generous; it's more intended to be
	 * supporter/Patreon like package, but also with proper value for the user.
	 *
	 * Think about this as "I want the best available option, regardless of the price".
	 */
	"package:master": {
		type: "subscription",
		access: "public",
		sort: 40,
		items: {
			"common:item:support": {
				amount: 10,
			},
			"common:item:token": {
				amount: 1000,
			},
			"common:item:agent.usage": {
				amount: 1000,
			},
			"seller:item:listing.early-delivery": {
				amount: 20,
			},
			"seller:item:listing.mark": {
				amount: 30,
			},
			"seller:item:listing.top": {
				amount: 15,
			},
			"seller:item:listing.top-maxxi": {
				amount: 6,
			},
		},
		limits: {
			"buyer:limit:feed.count": {
				limit: 30,
			},
			"seller:limit:listing.count": {
				limit: 100,
			},
			"seller:limit:listing.gallery.count": {
				limit: 30,
			},
			"common:limit:agent.token": {
				limit: 25_000,
			},
			"common:limit:agent.handbrake": {
				limit: 10_000_000,
			},
		},
		features: {
			"buyer:feature:anti-topper": {},
			"buyer:feature:history": {},
			"buyer:feature:listing.early-discovery": {},
			"buyer:feature:seller.info": {},
			"seller:feature:brand": {},
			"seller:feature:buyer.info": {},
			"seller:feature:listing.longer-expiration": {},
			"seller:feature:payback": {},
			"seller:feature:listing.info": {},
		},
	},

	/**
	 * Those packages are extras a user can buy with various setup
	 */
	"extra:token:small": {
		type: "extra",
		access: "public",
		sort: 10,
		items: {
			"common:item:token": {
				amount: 149,
			},
		},
		limits: {},
		features: {},
	},
	"extra:token:medium": {
		type: "extra",
		access: "public",
		sort: 20,
		items: {
			"common:item:token": {
				amount: 399,
			},
		},
		limits: {},
		features: {},
	},
	"extra:token:large": {
		type: "extra",
		access: "public",
		sort: 30,
		items: {
			"common:item:token": {
				amount: 999,
			},
		},
		limits: {},
		features: {},
	},
	"extra:mark": {
		type: "extra",
		access: "public",
		sort: 40,
		items: {
			"seller:item:listing.mark": {
				amount: 10,
			},
		},
		limits: {},
		features: {},
	},
	"extra:top": {
		type: "extra",
		access: "public",
		sort: 50,
		items: {
			"seller:item:listing.top": {
				amount: 10,
			},
		},
		limits: {},
		features: {},
	},
	"extra:top-maxxi": {
		type: "extra",
		access: "public",
		sort: 60,
		items: {
			"seller:item:listing.top-maxxi": {
				amount: 3,
			},
		},
		limits: {},
		features: {},
	},
	"extra:brand": {
		type: "extra",
		access: "public",
		sort: 70,
		items: {},
		limits: {},
		features: {
			"seller:feature:brand": {},
		},
	},
	"extra:early-delivery": {
		type: "extra",
		access: "public",
		sort: 80,
		items: {
			"seller:feature:listing.early-delivery": {
				amount: 5,
			},
		},
		limits: {},
		features: {},
	},
	"extra:extra-listings": {
		type: "extra",
		access: "public",
		sort: 90,
		items: {},
		limits: {
			"seller:limit:listing.count": {
				limit: 20,
			},
		},
		features: {},
	},

	/**
	 * Promo bundles assigned by the system, not sold directly.
	 */

	/**
	 * One-shot welcome promo assigned to new users.
	 */
	"welcome:default": {
		type: "promo",
		access: "protected",
		sort: 10,
		items: {
			"common:item:agent.usage": {
				amount: 75,
			},
			"common:item:support": {
				amount: 3,
			},
		},
		limits: {
			"seller:limit:listing.count": {
				limit: 10,
			},
			"seller:limit:listing.gallery.count": {
				limit: 8,
			},
			"common:limit:agent.token": {
				limit: 10_000,
			},
			"common:limit:agent.handbrake": {
				limit: 750_000,
			},
		},
		features: {},
	},
	/**
	 * One-shot promo assigned to founders wave of users.
	 */
	"welcome:founders:promo": {
		type: "promo",
		access: "protected",
		sort: 20,
		items: {
			"common:item:support": {
				amount: 10,
			},
			"common:item:token": {
				amount: 300,
			},
			"common:item:agent.usage": {
				amount: 500,
			},
			"seller:item:listing.early-delivery": {
				amount: 10,
			},
			"seller:item:listing.mark": {
				amount: 15,
			},
			"seller:item:listing.top": {
				amount: 8,
			},
			"seller:item:listing.top-maxxi": {
				amount: 3,
			},
		},
		limits: {
			"buyer:limit:feed.count": {
				limit: 20,
			},
			"seller:limit:listing.count": {
				limit: 50,
			},
			"seller:limit:listing.gallery.count": {
				limit: 20,
			},
			"common:limit:agent.token": {
				limit: 15_000,
			},
			"common:limit:agent.handbrake": {
				limit: 5_000_000,
			},
		},
		features: {
			"buyer:feature:anti-topper": {},
			"buyer:feature:history": {},
			"buyer:feature:listing.early-discovery": {},
			"buyer:feature:seller.info": {},
			"seller:feature:brand": {},
			"seller:feature:buyer.info": {},
			"seller:feature:listing.longer-expiration": {},
			"seller:feature:payback": {},
			"seller:feature:listing.info": {},
		},
	},
	/**
	 * Permanent promo assigned to founders wave.
	 */
	"welcome:founders": {
		type: "promo",
		access: "protected",
		sort: 30,
		items: {},
		limits: {
			"buyer:limit:feed.count": {
				limit: 10,
			},
			"seller:limit:listing.count": {
				limit: 10,
			},
			"seller:limit:listing.gallery.count": {
				limit: 8,
			},
		},
		features: {
			"common:feature:founder": {},
		},
	},
};
