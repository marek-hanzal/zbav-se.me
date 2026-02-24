import { createFileRoute } from "@tanstack/react-router";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import z from "zod";
import { FeedListPage } from "~/app/@buyer-user/feed/page/FeedListPage";

export const Route = createFileRoute("/$locale/flow/buyer/feed/$id/list")({
	validateSearch: z.object({
		/**
		 * If needed, we can restore scroll position to a particular listing.
		 */
		scrollToId: z.string().optional(),
	}),
	async loader({ context: { queryClient }, params: { id } }) {
		/**
		 * This will force update "updatedAt" field, so we'll mark "this" feed as the "last visited" one.
		 */
		const feed = await withFeedPatchMutation.mutate(queryClient, {
			patch: {},
			query: {
				where: {
					id,
				},
			},
		});

		return {
			feed,
		};
	},
	/**
	 * We've loader, so we also need pending component.
	 */
	pendingComponent: SpinnerContainer,
	component() {
		const { scrollToId } = Route.useSearch();
		const { feed } = Route.useLoaderData();

		return (
			<FeedListPage
				feed={feed}
				scrollToId={scrollToId}
			/>
		);
	},
});
