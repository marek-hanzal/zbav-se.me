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
	"package:welcome.promo": {
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
		},
		features: {},
	},
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
		},
		features: {},
	},
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
		},
		features: {
			"buyer:feature:anti-topper": {},
			"buyer:feature:history": {},
			"buyer:feature:listing.early-discovery": {},
			"buyer:feature:seller.info": {},
		},
	},
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
		},
		features: {
			"seller:feature:buyer.info": {},
			"seller:feature:listing.info": {},
			"seller:feature:payback": {},
			"seller:feature:listing.longer-expiration": {},
		},
	},
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
	"extra:founders.promo": {
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
	"extra:founders.lifetime": {
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
