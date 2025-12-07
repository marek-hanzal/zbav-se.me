import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon, ListingIcon } from "@zbav-se.me/ui/icon";
import { useRef, useState } from "react";
import z from "zod";
import { FeedSetupButton } from "~/app/feed/ui/button/FeedSetupButton";
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
		const [isFeedSettings1, setIsFeedSettings1] = useState(false);
		const [isFeedSettings2, setIsFeedSettings2] = useState(false);
		const containerRef = useRef<HTMLDivElement>(null);

		return (
			<FlowContainer
				ui={"FeedList-root"}
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
										value: isFeedSettings1,
										set: setIsFeedSettings1,
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
											setIsFeedSettings1(false);
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
									/**
									 * Listings in feed should be scored
									 */
									withScore
									query={{
										...feed.query,
										sort: feed.query.sort?.length
											? feed.query.sort
											: [
													{
														field: "createdAt",
														direction: "desc",
													},
												],
										meta: {
											feedId: feed.id,
											...feed.query.meta,
										},
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
											layout={"vertical-centered"}
											height={"full"}
										>
											<Status
												icon={DeadEndIcon}
												textTitle={"That's all for now (title)"}
												action={
													<>
														<FeedSetupButton
															locale={locale}
															feed={feed}
															defaultOpen={false}
															noDelete
															state={{
																value: isFeedSettings2,
																set: setIsFeedSettings2,
															}}
															size={"xl"}
															menu
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
																	setIsFeedSettings2(false);
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
																	label={
																		"Refresh listings (button)"
																	}
																	size={"xl"}
																	menu
																/>
															</LinkTo>
														</FeedSetupButton>

														<LinkTo
															to={"/$locale/buyer"}
															params={{
																locale,
															}}
															full
														>
															<Button
																iconEnabled={ArrowRightIcon}
																iconPosition={"right"}
																tone={"primary"}
																label={"Back to home (link)"}
																size={"xl"}
																menu
															/>
														</LinkTo>
													</>
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
