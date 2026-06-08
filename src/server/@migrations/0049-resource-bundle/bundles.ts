import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

const inMonth = 30 * 24 * 60 * 60;

export const bundles: Record<
	ResourceBundleEnumSchema.Type,
	{
		items: Partial<
			Record<
				ResourceDefinitionEnumSchema.Type,
				{
					amount: number;
					expiration: number | null;
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
		items: {
			"common:item:support": {
				amount: 1,
				expiration: inMonth,
			},
			"common:item:agent.usage": {
				amount: 30,
				expiration: inMonth,
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
		items: {
			"common:item:support": {
				amount: 3,
				expiration: inMonth,
			},
			"common:item:token": {
				amount: 150,
				expiration: null,
			},
			"common:item:agent.usage": {
				amount: 150,
				expiration: inMonth,
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
		items: {
			"common:item:support": {
				amount: 3,
				expiration: inMonth,
			},
			"seller:item:listing.early-delivery": {
				amount: 3,
				expiration: inMonth,
			},
			"common:item:token": {
				amount: 150,
				expiration: null,
			},
			"common:item:agent.usage": {
				amount: 120,
				expiration: inMonth,
			},
			"seller:item:listing.mark": {
				amount: 5,
				expiration: inMonth,
			},
			"seller:item:listing.top": {
				amount: 3,
				expiration: inMonth,
			},
			"seller:item:listing.top-maxxi": {
				amount: 1,
				expiration: inMonth,
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
		items: {
			"common:item:support": {
				amount: 5,
				expiration: inMonth,
			},
			"common:item:token": {
				amount: 300,
				expiration: null,
			},
			"common:item:agent.usage": {
				amount: 300,
				expiration: inMonth,
			},
			"seller:item:listing.early-delivery": {
				amount: 6,
				expiration: inMonth,
			},
			"seller:item:listing.mark": {
				amount: 10,
				expiration: inMonth,
			},
			"seller:item:listing.top": {
				amount: 6,
				expiration: inMonth,
			},
			"seller:item:listing.top-maxxi": {
				amount: 3,
				expiration: inMonth,
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
		items: {
			"common:item:support": {
				amount: 10,
				expiration: inMonth,
			},
			"common:item:token": {
				amount: 1000,
				expiration: null,
			},
			"common:item:agent.usage": {
				amount: 1000,
				expiration: inMonth,
			},
			"seller:item:listing.early-delivery": {
				amount: 20,
				expiration: inMonth,
			},
			"seller:item:listing.mark": {
				amount: 30,
				expiration: inMonth,
			},
			"seller:item:listing.top": {
				amount: 15,
				expiration: inMonth,
			},
			"seller:item:listing.top-maxxi": {
				amount: 6,
				expiration: inMonth,
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
		items: {
			"common:item:token": {
				amount: 149,
				expiration: null,
			},
		},
		limits: {},
		features: {},
	},
	"extra:token:medium": {
		items: {
			"common:item:token": {
				amount: 399,
				expiration: null,
			},
		},
		limits: {},
		features: {},
	},
	"extra:token:large": {
		items: {
			"common:item:token": {
				amount: 999,
				expiration: null,
			},
		},
		limits: {},
		features: {},
	},

	/**
	 * Extra bundles not being sold directly
	 */

	/**
	 * One-shot welcome bundle assigned to new users.
	 */
	"welcome:default": {
		items: {
			"common:item:agent.usage": {
				amount: 75,
				expiration: inMonth * 2,
			},
			"common:item:support": {
				amount: 3,
				expiration: inMonth * 2,
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
	 * One-shot bundle assigned to founders wave of users.
	 */
	"welcone:founders:promo": {
		items: {
			"common:item:support": {
				amount: 10,
				expiration: inMonth,
			},
			"common:item:token": {
				amount: 300,
				expiration: null,
			},
			"common:item:agent.usage": {
				amount: 500,
				expiration: inMonth,
			},
			"seller:item:listing.early-delivery": {
				amount: 10,
				expiration: inMonth,
			},
			"seller:item:listing.mark": {
				amount: 15,
				expiration: inMonth,
			},
			"seller:item:listing.top": {
				amount: 8,
				expiration: inMonth,
			},
			"seller:item:listing.top-maxxi": {
				amount: 3,
				expiration: inMonth,
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
	 * Permanent bundle assigned to founders wave
	 */
	"welcone:founders": {
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
