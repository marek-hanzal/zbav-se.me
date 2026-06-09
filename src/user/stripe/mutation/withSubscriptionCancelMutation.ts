import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withBundleActiveQuery } from "~/user/resource-bundle/query/withBundleActiveQuery";
import { withBundleCollectionQuery } from "~/user/stripe/query/withBundleCollectionQuery";
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

				await Promise.all([
					withBundleActiveQuery.invalidate(queryClient, {
						bundle: result.bundle,
					}),
					withBundleCollectionQuery.invalidate(queryClient),
				]);
			},
		},
	],
	async mutationFn(data) {
		return subscriptionCancelFn({
			data,
		});
	},
});
