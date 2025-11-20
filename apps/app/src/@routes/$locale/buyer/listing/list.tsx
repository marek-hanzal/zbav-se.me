import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { zListingQuery } from "@zbav-se.me/sdk/api/user";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import { Sheet } from "@zbav-se.me/ui/sheet";
import z from "zod";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";
import { FeedListingOverlay } from "~/app/listing/ui/overlay/FeedListingOverlay";
import { ListingFeedToolbar } from "~/app/listing/ui/toolbar/ListingFeedToolbar";
import { BadgeLeft } from "~/app/ui/badge/BadgeLeft";

export const Route = createFileRoute("/$locale/buyer/listing/list")({
	validateSearch: z.object({
		scrollToListingId: z.string().optional(),
		query: zListingQuery.optional(),
	}),
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						to={"/$locale/buyer/feed/select"}
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
		const { locale } = Route.useParams();
		const { scrollToListingId, query } = Route.useSearch();

		return (
			<FlowContainer
				left={
					<LinkTo
						to={"/$locale/buyer/feed/select"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
			>
				<ListingListContainer
					overlay={({ listing }) => <FeedListingOverlay listing={listing} />}
					toolbar={({ query, listing }) => (
						<ListingFeedToolbar
							query={query}
							listing={listing}
						/>
					)}
					imageErrorToolbar={({ query, listing }) => (
						<ListingFeedToolbar
							query={query}
							listing={listing}
							snapTo={"unset"}
							horizontal
							flip
							tools={[
								"flag",
								"ignore",
							]}
						/>
					)}
					query={{
						...query,
						/**
						 * Cursor is hardcoded, so only first 200 listings are fetched.
						 */
						cursor: {
							page: 0,
							size: 1000,
						},
					}}
					scrollToListingId={scrollToListingId}
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
