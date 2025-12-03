import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { FeedSetupButton } from "@zbav-se.me/common/feed";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon, ListingIcon } from "@zbav-se.me/ui/icon";
import { useRef, useState } from "react";
import z from "zod";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";
import { FeedListingOverlay } from "~/app/listing/ui/overlay/FeedListingOverlay";

export const Route = createFileRoute("/$locale/buyer/feed/$id/list")({
	validateSearch: z.object({
		/**
		 * If needed, we can restore scroll position to a particular listing
		 */
		scrollToId: z.string().optional(),
	}),
	async loader({ context: { queryClient }, params: { id } }) {
		/**
		 * This will force update "updatedAt" field, so we'll mark "this" feed as the "last visited" one.
		 */
		await withFeedPatchMutation.mutate(queryClient, {
			id,
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
	component() {
		const { id, locale } = Route.useParams();
		const { scrollToId } = Route.useSearch();
		const [isFeedSettings, setIsFeedSettings] = useState(false);
		const containerRef = useRef<HTMLDivElement>(null);

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
				<withFeedFetchQuery.Suspense
					data={{
						where: {
							id,
						},
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data: feed }) => {
						return (
							<>
								<FeedSetupButton
									locale={locale}
									state={{
										value: isFeedSettings,
										set: setIsFeedSettings,
									}}
									iconProps={{
										size: "md",
									}}
									feed={feed}
									tone={"secondary"}
									theme={"light"}
									defaultOpen={false}
									noDelete={true}
									round={"full"}
									label={null}
									size={"md"}
									snapTo={"top-right"}
									tweak={{
										slot: {
											wrapper: {
												class: [
													"z-5",
												],
											},
										},
									}}
								>
									<LinkTo
										to={"/$locale/buyer/feed/$id/list"}
										params={{
											locale,
											id: feed.id,
										}}
										resetScroll
										full
										onClick={() => {
											setIsFeedSettings(false);
											containerRef.current?.scrollTo({
												top: 0,
												behavior: "instant",
											});
										}}
									>
										<Button
											iconEnabled={ListingIcon}
											tone={"primary"}
											theme={"light"}
											label={"Refresh listings (button)"}
											size={"xl"}
											menu
										/>
									</LinkTo>
								</FeedSetupButton>

								<ListingListContainer
									ref={containerRef}
									locale={locale}
									feedId={feed.id}
									query={{
										...feed.query,
										/**
										 * Hardcoded cursor to fetch the first page; we're assuming an user won't go through
										 * thousands of listings, so we can do hard cap here.
										 */
										cursor: {
											page: 0,
											size: 256,
										},
									}}
									overlay={({ listing }) => (
										<FeedListingOverlay
											locale={locale}
											listing={listing}
										/>
									)}
									scrollToId={scrollToId}
									appendix={
										<Container
											round={"unset"}
											height={"fit"}
										>
											<Status
												icon={DeadEndIcon}
												textTitle={"That's all for now (title)"}
												textMessage={"No more listings to show (message)"}
												action={
													<LinkTo
														to={"/$locale/buyer"}
														params={{
															locale,
														}}
													>
														<Button
															iconEnabled={ArrowLeftIcon}
															tone={"secondary"}
															label={"Back to home (link)"}
														/>
													</LinkTo>
												}
											/>
										</Container>
									}
								/>
							</>
						);
					}}
				</withFeedFetchQuery.Suspense>
			</FlowContainer>
		);
	},
});
