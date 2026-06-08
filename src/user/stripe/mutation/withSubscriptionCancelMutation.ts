import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withBundleActiveQuery } from "~/user/resource-bundle/query/withBundleActiveQuery";
import { subscriptionCancelFn } from "../fn/subscriptionCancelFn";
import type { BillingSubscriptionCancelResultSchema } from "../server/schema/BillingSubscriptionCancelResultSchema";
import type { BillingSubscriptionCancelSchema } from "../server/schema/BillingSubscriptionCancelSchema";

export const withSubscriptionCancelMutation = withMutation<
	BillingSubscriptionCancelSchema.Type,
	BillingSubscriptionCancelResultSchema.Type,
	subscriptionCancelFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withSubscriptionCancelMutation",
	]),
	keys(variables) {
		return [
			"stripe",
			"subscription",
			"cancel",
			variables,
		];
	},
	invalidate: [
		{
			async invalidate(queryClient, result) {
				if (!result) {
					return;
				}

				await withBundleActiveQuery.invalidate(queryClient, {
					bundle: result.bundle,
				});
			},
		},
	],
	async mutationFn(data) {
		return subscriptionCancelFn({
			data,
		});
	},
});
