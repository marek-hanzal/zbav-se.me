import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { type FC, type Ref, useState } from "react";
import { EmptyListing } from "./EmptyListing";

export namespace Content {
	export interface Props {
		sentinelRef: Ref<HTMLDivElement | null>;
		isLast: boolean;
	}
}

export const Content: FC<Content.Props> = ({ sentinelRef, isLast, ...props }) => {
	const [isFeedSettings, setIsFeedSettings] = useState(false);
	const { data: listingCount } = withListingQuery.useCountQuery({});

	if (listingCount.isEmpty) {
		return <EmptyListing />;
	}

	return (
		<>
			<Button
				data-ui={"FeedSetupButton[SheetButton]"}
				iconEnabled={SettingsIcon}
				onClick={() => setIsFeedSettings((prev) => !prev)}
				ui={{
					tone: "secondary",
					theme: "light",
					background: "default",
					justify: "center",
					items: "center",
					square: "default",
					zIndex: true,
					round: "full",
					snapTo: "top-right",
					text: "xl",
					opacity: isLast ? "none" : "8",
				}}
				className={"transition-all"}
			/>

			<ListingListContainerSuspense
				data-ui={"BuyerFeedList-[ListingListContainer]"}
				ref={containerRef}
				feedId={feed.id}
				/**
				 * Listings in feed should be scored.
				 */
				withScore
				query={{
					...feed.query,
					sort: feed.query.sort?.length
						? feed.query.sort
						: getFeedDefaultCreate("default").query.sort,
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
				scrollToId={scrollToId}
				renderEmptyFn={() => (
					<FeedListStatus
						ref={sentinelRef}
						mode={"empty"}
						state={{
							value: isFeedSettings,
							set: setIsFeedSettings,
						}}
					/>
				)}
				appendix={
					<FeedListStatus
						ref={sentinelRef}
						mode={"appendix"}
						state={{
							value: isFeedSettings,
							set: setIsFeedSettings,
						}}
					/>
				}
			/>

			<FeedEditorSheetSuspense
				feedId={feed.id}
				state={{
					value: isFeedSettings,
					set: setIsFeedSettings,
				}}
				onRefresh={() => {
					setIsFeedSettings(false);
					setTimeout(() => router.invalidate(), 200);
				}}
			/>
		</>
	);
};
