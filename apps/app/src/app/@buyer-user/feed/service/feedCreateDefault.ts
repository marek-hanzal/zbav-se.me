import type { QueryClient } from "@tanstack/react-query";
import { translator } from "@use-pico/common/translator";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";

export namespace feedCreateDefault {
	export interface Props {
		queryClient: QueryClient;
	}
}

/**
 * Creates a default feed with predefined query parameters and sorting.
 *
 * This function creates a new feed with a translated default name and configures it
 * to show listings excluding owned and ignored items, sorted by creation date (newest first),
 * price (lowest first), condition (best first), and age (newest first).
 *
 * @param props - Configuration object for creating the default feed
 * @param props.queryClient - TanStack Query client instance used to execute the mutation
 * @returns Promise that resolves when the feed creation mutation completes
 */
export const feedCreateDefault = async ({ queryClient }: feedCreateDefault.Props) => {
	return withFeedCreateMutation.mutate(queryClient, {
		/**
		 * Translated feed name
		 */
		name: translator.text("Feed name (default)"),
		query: {
			where: {
				withIgnored: false,
			},
			sort: [
				{
					field: "createdAt",
					direction: "desc",
				},
				{
					field: "price",
					direction: "asc",
				},
				{
					field: "condition",
					direction: "desc",
				},
				{
					field: "age",
					direction: "desc",
				},
			],
		},
	});
};
