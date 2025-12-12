import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon, ListingIcon } from "@zbav-se.me/ui/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { useRef, useState } from "react";
import z from "zod";
import { FeedSetupButton } from "~/app/feed/ui/button/FeedSetupButton";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";

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
			patch: {},
			query: {
				where: {
					id,
				},
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
						to={"/$locale/ui/buyer"}
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
	component() {
		const { id, locale } = Route.useParams();
		const { scrollToId } = Route.useSearch();
		const [isFeedSettings1, setIsFeedSettings1] = useState(false);
		const [isFeedSettings2, setIsFeedSettings2] = useState(false);
		const containerRef = useRef<HTMLDivElement>(null);

		return (
			<FlowContainer
				data-ui={"/buyer/feed/$id/list[FlowContainer]"}
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						data-ui={"/buyer/feed/$id/list-[LinkTo.left]"}
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
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
									data-ui={"/buyer/feed/$id/list-[FeedSetupButton]"}
									locale={locale}
									state={{
										value: isFeedSettings1,
										set: setIsFeedSettings1,
									}}
									feed={feed}
									defaultOpen={false}
									noDelete={true}
									label={null}
									ui={{
										tone: "secondary",
										theme: "light",
										justify: "center",
										items: "center",
										square: "default",
										zIndex: true,
										round: "full",
										snapTo: "top-right",
										text: "xl",
										opacity: "low",
									}}
								>
									<LinkTo
										data-ui={"/buyer/feed/$id/list-[LinkTo.refresh]"}
										to={"/$locale/buyer/feed/$id/list"}
										params={{
											locale,
											id: feed.id,
										}}
										resetScroll
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
											label={"Refresh listings (button)"}
											ui={{
												size: "xl",
												justify: "start",
											}}
										/>
									</LinkTo>
								</FeedSetupButton>

								<ListingListContainer
									data-ui={"/buyer/feed/$id/list-[ListingListContainer]"}
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
										<ListingOverlay
											locale={locale}
											listing={listing}
										/>
									)}
									scrollToId={scrollToId}
									appendix={
										<Container
											ui={{
												layout: "vertical-centered",
												height: "full",
											}}
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
															ui={{
																size: "xl",
																justify: "start",
															}}
														>
															<LinkTo
																to={"/$locale/buyer/feed/$id/list"}
																params={{
																	locale,
																	id: feed.id,
																}}
																resetScroll
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
																	label={
																		"Refresh listings (button)"
																	}
																	ui={{
																		size: "xl",
																		justify: "start",
																	}}
																/>
															</LinkTo>
														</FeedSetupButton>

														<LinkTo
															to={"/$locale/buyer"}
															params={{
																locale,
															}}
														>
															<Button
																iconEnabled={ArrowRightIcon}
																iconPosition={"right"}
																label={"Back to home (link)"}
																ui={{
																	size: "xl",
																	justify: "start",
																}}
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
