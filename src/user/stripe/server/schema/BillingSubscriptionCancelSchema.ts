import { z } from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const BillingSubscriptionCancelSchema = z
	.looseObject({
		bundle: ResourceBundleEnumSchema,
	})
	.strip();

export type BillingSubscriptionCancelSchema = typeof BillingSubscriptionCancelSchema;

export namespace BillingSubscriptionCancelSchema {
	export type Type = z.infer<BillingSubscriptionCancelSchema>;
}
