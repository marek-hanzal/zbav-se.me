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
			"seller:feature:brand": {},
			"seller:feature:buyer.info": {},
			"seller:feature:listing.info": {},
			"seller:feature:payback": {},
			"seller:feature:listing.longer-expiration": {},
		},
	},
	"package:pro": {
		items: {
			"common:item:agent.usage": {
				amount: 300,
				expiration: inMonth,
			},
		},
		limits: {},
		features: {},
	},
	"package:master": {
		items: {
			"common:item:agent.usage": {
				amount: 600,
				expiration: inMonth,
			},
		},
		limits: {},
		features: {},
	},
	"extra:founders.promo": {
		items: {},
		limits: {
			"seller:limit:listing.count": {
				limit: 30,
			},
			"seller:limit:listing.gallery.count": {
				limit: 20,
			},
		},
		features: {},
	},
	"extra:founders.lifetime": {
		items: {},
		limits: {},
		features: {},
	},
};
