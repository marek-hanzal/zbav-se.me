import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

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
		items: {},
		limits: {},
		features: {},
	},
	"package:free": {
		items: {
			"common:item:agent.usage": {
				amount: 30,
				expiration: null,
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
			"common:item:token-small": {
				amount: 150,
				expiration: null,
			},
			"common:item:agent.usage": {
				amount: 150,
				expiration: 31 * 24 * 60 * 60,
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
				expiration: null,
			},
			"common:item:token-small": {
				amount: 150,
				expiration: null,
			},
			"common:item:agent.usage": {
				amount: 120,
				expiration: 31 * 24 * 60 * 60,
			},
		},
		limits: {},
		features: {
			"seller:feature:buyer.info": {},
		},
	},
	"package:pro": {
		items: {
			"common:item:agent.usage": {
				amount: 300,
				expiration: 31 * 24 * 60 * 60,
			},
		},
		limits: {},
		features: {},
	},
	"package:master": {
		items: {
			"common:item:agent.usage": {
				amount: 600,
				expiration: 31 * 24 * 60 * 60,
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
