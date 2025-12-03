import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { FeedSetupButton } from "@zbav-se.me/common/feed";
import { zListingQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon, ListingIcon } from "@zbav-se.me/ui/icon";
import { Sheet } from "@zbav-se.me/ui/sheet";
import { useEffect } from "react";
import z from "zod";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";
import { FeedListingOverlay } from "~/app/listing/ui/overlay/FeedListingOverlay";

export const Route = createFileRoute("/$locale/buyer/listing/list")({
	validateSearch: z.object({
		scrollToId: z.string().optional(),
		feedId: z.string().optional(),
		query: zListingQuery.optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const { scrollToId, query, feedId } = Route.useSearch();
		const mutation = withFeedPatchMutation.useMutation();

		useEffect(() => {
			if (feedId) {
				/**
				 * Just bumps feed updatedAt
				 */
				mutation.mutate({
					id: feedId,
				});
			}
		}, [
			feedId,
		]);

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
				{feedId ? (
					<withFeedFetchQuery.Suspense
						data={{
							where: {
								id: feedId,
							},
						}}
						fallback={
							<Button
								loading
								menu
							/>
						}
					>
						{({ data }) => {
							return (
								<FeedSetupButton
									locale={locale}
									iconProps={{
										size: "md",
									}}
									feed={data}
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
										to={"/$locale/buyer/listing/list"}
										params={{
											locale,
										}}
										search={{
											feedId: data.id,
											query: data.query,
										}}
										resetScroll
										full
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
							);
						}}
					</withFeedFetchQuery.Suspense>
				) : null}

				<ListingListContainer
					locale={locale}
					feedId={feedId}
					overlay={({ listing }) => (
						<FeedListingOverlay
							locale={locale}
							listing={listing}
						/>
					)}
					query={{
						...query,
						/**
						 * Cursor is hardcoded
						 */
						cursor: {
							page: 0,
							size: 256,
						},
					}}
					scrollToId={scrollToId}
					appendix={
						<Sheet round={"unset"}>
							<Status
								icon={DeadEndIcon}
								textTitle={"That's all for now (title)"}
								textMessage={"No more listings to show (message)"}
								action={
									<LinkTo
										to={"/$locale/buyer/feed/select"}
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
						</Sheet>
					}
				/>
			</FlowContainer>
		);
	},
});
