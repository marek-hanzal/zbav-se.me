import { createFileRoute, redirect } from "@tanstack/react-router";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/feed/default")({
	/**
	 * Simple stuff:
	 *
	 * - pick most recent feed (create a new one if not present)
	 * - redirect user to listings with that feedId
	 *
	 * The idea is to _ensure_ we've a feed a user _can_ customize
	 */
	async loader({ context: { queryClient }, params: { locale } }) {
		let feed = await withFeedFetchQuery
			.query({
				sort: [
					{
						field: "updatedAt",
						direction: "desc",
					},
				],
			})
			/**
			 * We're getting 4o4, if the feed is not found
			 */
			.catch(() => undefined);

		/**
		 * No default? Ok, let's create default one
		 */
		if (!feed) {
			feed = await withFeedCreateMutation.mutate(queryClient, {
				/**
				 * Translated feed name
				 */
				name: translator.text("Feed name (default)"),
				query: {
					where: {
						withOwn: false,
					},
				},
			});
		}

		throw redirect({
			to: "/$locale/buyer/feed/$id/list",
			params: {
				locale,
				id: feed.id,
			},
		});
	},
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
			>
				<SpinnerContainer />
			</FlowContainer>
		);
	},
});
