import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { withFavouriteCountQuery } from "@zbav-se.me/sdk/query/user";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/flow/buyer/feed/$id/favourite/list")({
	component() {
		const { locale } = Route.useParams();
		const { id } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/ui/buyer/favourite/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<ListingListContainer
					locale={locale}
					feedId={id}
					/**
					 * Don't count score for listings in favourites
					 */
					withScore={false}
					scrollToId={undefined}
					query={{
						where: {
							feedId: id,
							isFavourite: true,
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
							<withFavouriteCountQuery.Suspense
								data={{}}
								fallback={<SpinnerContainer />}
							>
								{({ data }) => {
									if (data.filter === 0) {
										return (
											<Status
												icon={DeadEndIcon}
												textTitle={
													"Empty favourite - category and favourite (title)"
												}
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
															to={"/$locale/ui/home"}
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
											textTitle={"Empty favourite category (title)"}
											action={
												<LinkTo
													to={"/$locale/ui/buyer/favourite/list"}
													params={{
														locale,
													}}
												>
													<Button
														iconEnabled={ArrowLeftIcon}
														label={"Back to favourites (link)"}
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
							</withFavouriteCountQuery.Suspense>
						);
					}}
					appendix={
						<Status
							icon={DeadEndIcon}
							textTitle={"That's all for now - favourite (title)"}
							textMessage={"No more listings to show - favourite (message)"}
							action={
								<div
									className={
										"flex flex-col gap-2 items-center justify-center w-full"
									}
								>
									<LinkTo
										to={"/$locale/ui/buyer/favourite/list"}
										params={{
											locale,
										}}
									>
										<Button
											iconEnabled={ArrowLeftIcon}
											label={"Back to favourites (link)"}
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
