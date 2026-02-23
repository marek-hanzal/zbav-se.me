import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { feedCreateDefault } from "~/app/@buyer-user/feed/service/feedCreateDefault";

export const Route = createFileRoute("/$locale/flow/buyer/feed/default")({
	/**
	 * Simple stuff:
	 *
	 * - pick most recent feed (create a new one if not present)
	 * - redirect user to listings with that feedId
	 *
	 * The idea is to _ensure_ we've a feed a user _can_ customize
	 */
	async loader({ context: { queryClient }, params: { locale } }) {
		let feed = await withFeedQuery
			.fetch({
				sort: [
					{
						field: "updatedAt",
						order: "desc",
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
			feed = await feedCreateDefault({
				queryClient,
			});
		}

		throw redirect({
			to: "/$locale/flow/buyer/feed/$id/list",
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
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/flow/home"}
						params={{
							locale,
						}}
					/>
				}
			>
				<SpinnerContainer />
			</FlowContainer>
		);
	},
});
