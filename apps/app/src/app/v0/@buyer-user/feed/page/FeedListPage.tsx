import { useRouter } from "@tanstack/react-router";
import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, useRef, useState } from "react";
import { ListingListContainerSuspense } from "~/app/v0/@buyer-user/listing/ui/ListingListContainerSuspense";
import { FeedEditorSheetSuspense } from "./FeedListPage/FeedEditorSheetSuspense";
import { FeedListStatus } from "./FeedListPage/FeedListStatus";
import { FeedSetupButton } from "./FeedListPage/FeedSetupButton";
import { FirstListingStatus } from "./FeedListPage/FirstListingStatus";

export namespace FeedListPage {
	export interface Props extends FlowContainer.Props {
		feed: tFeed;
		scrollToId: string | undefined;
	}
}

export const FeedListPage: FC<FeedListPage.Props> = ({ feed, scrollToId, ...props }) => {
	const locale = useLocale();
	const router = useRouter();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isFeedSettings, setIsFeedSettings] = useState(false);

	const { data: listingCount } = withListingQuery.useCount({});

	const { sentinelRef, inView: isLast } = useSentinel<HTMLDivElement>({
		containerRef,
		threshold: 0.25,
	});

	return (
		<FlowContainer
			data-ui={"BuyerFeedList[FlowContainer]"}
			left={
				<LinkTo
					{...uiBackButton({
						ui: {
							opacity: isLast ? "full" : "low",
						},
						className: [],
					})}
					data-ui={"BuyerFeedList-[LinkTo.left]"}
					icon={ArrowLeftIcon}
					to={"/$locale/home"}
					params={{
						locale,
					}}
					className={"transition-all"}
				/>
			}
			{...props}
		>
			{listingCount.isEmpty ? null : (
				<>
					<FeedSetupButton
						state={{
							value: isFeedSettings,
							set: setIsFeedSettings,
						}}
						ui={{
							opacity: isLast ? "full" : "low",
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
								: [
										{
											field: "createdAt",
											order: "desc",
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
				</>
			)}

			{listingCount.isEmpty ? <FirstListingStatus /> : null}

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
		</FlowContainer>
	);
};
