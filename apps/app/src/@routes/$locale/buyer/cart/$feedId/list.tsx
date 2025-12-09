import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button, uiButton } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { withListingCartCountQuery } from "@zbav-se.me/sdk/query/user";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";
import { FeedListingOverlay } from "~/app/listing/ui/overlay/FeedListingOverlay";

export const Route = createFileRoute("/$locale/buyer/cart/$feedId/list")({
	component() {
		const { locale } = Route.useParams();
		const { feedId } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						{...uiButton({
							ui: {
								size: "md",
								round: "full",
								opacity: "subtle",
							},
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/cart/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<ListingListContainer
					locale={locale}
					feedId={feedId}
					/**
					 * Don't count score for listings in cart
					 */
					withScore={false}
					scrollToId={undefined}
					overlay={({ listing }) => (
						<FeedListingOverlay
							locale={locale}
							listing={listing}
						/>
					)}
					query={{
						where: {
							feedId,
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
															to={"/$locale/buyer/feed/default"}
															params={{
																locale,
															}}
														>
															<Button
																iconEnabled={ArrowRightIcon}
																iconPosition={"right"}
																label={"Go to feed (link)"}
																ui={{
																	tone: "primary",
																	justify: "start",
																	size: "xl",
																}}
															/>
														</LinkTo>

														<LinkTo
															to={"/$locale/buyer"}
															params={{
																locale,
															}}
														>
															<Button
																iconEnabled={ArrowRightIcon}
																iconPosition={"right"}
																label={"Go to home (link)"}
																ui={{
																	tone: "primary",
																	justify: "start",
																	size: "xl",
																}}
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
														label={"Back to cart (link)"}
														ui={{
															tone: "secondary",
															size: "xl",
														}}
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
									>
										<Button
											iconEnabled={ArrowLeftIcon}
											label={"Back to cart (link)"}
											ui={{
												tone: "secondary",
												size: "xl",
											}}
										/>
									</LinkTo>

									<LinkTo
										to={"/$locale/buyer/feed/default"}
										params={{
											locale,
										}}
									>
										<Button
											iconEnabled={ArrowRightIcon}
											iconPosition={"right"}
											label={"Go to feed (link)"}
											ui={{
												tone: "secondary",
												size: "xl",
											}}
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
