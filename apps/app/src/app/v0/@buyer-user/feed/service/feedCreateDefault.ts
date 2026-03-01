import type { QueryClient } from "@tanstack/react-query";
import { translator } from "@use-pico/common/translator";
import type { tFeedCreate } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";

export namespace feedCreateDefault {
	export interface Props {
		queryClient: QueryClient;
	}

	export interface CreateProps {
		name: string;
	}
}

export const toFeedCreate = ({ name }: feedCreateDefault.CreateProps): tFeedCreate => {
	return {
		name,
		query: {
			where: {
				withIgnored: false,
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
				{
					field: "price",
					order: "asc",
				},
				{
					field: "condition",
					order: "desc",
				},
				{
					field: "age",
					order: "desc",
				},
			],
		},
	};
};

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
	return withFeedCreateMutation.mutate(
		queryClient,
		toFeedCreate({
			/**
			 * Translated feed name
			 */
			name: translator.text("Feed name (default)"),
		}),
	);
};
