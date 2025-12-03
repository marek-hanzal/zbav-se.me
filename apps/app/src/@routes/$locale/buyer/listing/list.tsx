import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { zListingQuery } from "@zbav-se.me/sdk/api/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import { Sheet } from "@zbav-se.me/ui/sheet";
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

		return (
			<FlowContainer
				left={
					feedId ? (
						<LinkTo
							to={"/$locale/buyer/feed/select"}
							params={{
								locale,
							}}
						>
							<BadgeLeft />
						</LinkTo>
					) : (
						<LinkTo
							to={"/$locale/buyer"}
							params={{
								locale,
							}}
						>
							<BadgeLeft />
						</LinkTo>
					)
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
