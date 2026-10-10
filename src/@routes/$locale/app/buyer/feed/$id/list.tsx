import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import z from "zod";
import { FlowContainer } from "~/application-ui/ui/container.exports";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { Content } from "~/buyer-feed/ui/Content/index";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/feed/$id/list")({
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
		await withFeedQuery.patchFn(queryClient, {
			patch: {},
			query: {
				where: {
					id,
				},
			},
		});
	},
	pendingComponent: () => {
		const locale = useLocale();

		return (
			<FlowContainer
				data-ui={"FeedListingPending[FlowContainer]"}
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<SpinnerContainer />
			</FlowContainer>
		);
	},
	component() {
		const { scrollToId } = Route.useSearch();
		const { id } = Route.useParams();

		const feedId = id;

		const locale = useLocale();
		const containerRef = useRef<HTMLDivElement>(null);
		const sentinelRef = useRef<HTMLDivElement>(null);

		return (
			<FlowContainer
				data-ui={"FeedListing[FlowContainer]"}
				ref={containerRef}
				left={
					<BackHomeButton
						to="/$locale/app/buyer/feed/list"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<Content
					_suspense={"I know"}
					feedId={feedId}
					scrollToId={scrollToId}
					sentinelRef={sentinelRef}
				/>
			</FlowContainer>
		);
	},
});
