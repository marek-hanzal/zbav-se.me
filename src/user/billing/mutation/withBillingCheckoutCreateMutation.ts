import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { billingCheckoutCreateFn } from "../fn/billingCheckoutCreateFn";
import { withBillingInfoQuery } from "../query/withBillingInfoQuery";
import type { BillingCheckoutCreateSchema } from "../server/schema/BillingCheckoutCreateSchema";
import type { BillingCheckoutSchema } from "../server/schema/BillingCheckoutSchema";

export const withBillingCheckoutCreateMutation = withMutation<
	BillingCheckoutCreateSchema.Type,
	BillingCheckoutSchema.Type,
	billingCheckoutCreateFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withBillingCheckoutCreateMutation",
	]),
	keys(variables) {
		return [
			"billing",
			"checkout",
			variables,
		];
	},
	async mutationFn(data) {
		return billingCheckoutCreateFn({
			data,
		});
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await withBillingInfoQuery.invalidate(queryClient);
			},
		},
	],
});
