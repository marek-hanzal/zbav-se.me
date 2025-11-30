import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { withListingCartCountQuery } from "@zbav-se.me/sdk/query/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { BuyerIcon, DeadEndIcon } from "@zbav-se.me/ui/icon";
import z from "zod";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";
import { FeedListingOverlay } from "~/app/listing/ui/overlay/FeedListingOverlay";

export const Route = createFileRoute("/$locale/buyer/cart/category/$id/feed")({
	validateSearch: z.object({
		scrollToListingId: z.string().optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const { scrollToListingId } = Route.useSearch();
		const { id } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						to={"/$locale/buyer/cart/list"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
			>
				<ListingListContainer
					locale={locale}
					overlay={({ listing }) => (
						<FeedListingOverlay
							locale={locale}
							listing={listing}
						/>
					)}
					query={{
						where: {
							categoryId: id,
							inCart: true,
							withIgnored: false,
						},
						/**
						 * Cursor is hardcoded, so only first 200 listings are fetched.
						 */
						cursor: {
							page: 0,
							size: 200,
						},
						sort: [
							{
								field: "expiresAt",
								direction: "desc",
							},
						],
					}}
					scrollToListingId={scrollToListingId}
					renderEmptyFn={() => {
						return (
							<withListingCartCountQuery.Suspense
								data={{}}
								fallback={<SpinnerContainer />}
							>
								{({ data }) => {
									if (data.filter === 0) {
										return (
											<Status
												icon={DeadEndIcon}
												textTitle={"Empty cart - category and cart (title)"}
												action={
													<div className="flex flex-col gap-2 items-center justify-center w-full">
														<LinkTo
															to={"/$locale/buyer/feed/select"}
															params={{
																locale,
															}}
															full
														>
															<Button
																iconEnabled={ArrowRightIcon}
																iconPosition={"right"}
																tone={"secondary"}
																label={"Go to feed (link)"}
																full
															/>
														</LinkTo>

														<LinkTo
															to={"/$locale/buyer"}
															params={{
																locale,
															}}
															full
														>
															<Button
																iconEnabled={BuyerIcon}
																tone={"secondary"}
																label={"Go to home (link)"}
																full
															/>
														</LinkTo>
													</div>
												}
											/>
										);
									}

									return (
										<Status
											icon={"icon-[streamline--sad-face-remix]"}
											textTitle={"Empty cart category (title)"}
											action={
												<LinkTo
													to={"/$locale/buyer/cart/list"}
													params={{
														locale,
													}}
												>
													<Button
														iconEnabled={ArrowLeftIcon}
														tone={"secondary"}
														label={"Back to cart (link)"}
													/>
												</LinkTo>
											}
										/>
									);
								}}
							</withListingCartCountQuery.Suspense>
						);
					}}
					appendix={
						<Status
							icon={DeadEndIcon}
							textTitle={"That's all for now - cart (title)"}
							textMessage={"No more listings to show - cart (message)"}
							action={
								<div
									className={
										"flex flex-col gap-2 items-center justify-center w-full"
									}
								>
									<LinkTo
										to={"/$locale/buyer/cart/list"}
										params={{
											locale,
										}}
										full
									>
										<Button
											iconEnabled={ArrowLeftIcon}
											tone={"secondary"}
											label={"Back to cart (link)"}
											full
										/>
									</LinkTo>

									<LinkTo
										to={"/$locale/buyer/feed/select"}
										params={{
											locale,
										}}
										full
									>
										<Button
											iconEnabled={ArrowRightIcon}
											iconPosition={"right"}
											tone={"secondary"}
											label={"Go to feed (link)"}
											full
										/>
									</LinkTo>
								</div>
							}
						/>
					}
				/>
			</FlowContainer>
		);
	},
});
