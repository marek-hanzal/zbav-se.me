import { useRouter } from "@tanstack/react-router";
import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, Suspense, useRef, useState } from "react";
import { FeedEditorSheet } from "~/app/@buyer-user/feed/ui/list-route/FeedEditorSheet";
import { FeedListStatus } from "~/app/@buyer-user/feed/ui/list-route/FeedListStatus";
import { FeedSetupButton } from "~/app/@buyer-user/feed/ui/list-route/FeedSetupButton";
import { FirstListingStatus } from "~/app/@buyer-user/feed/ui/list-route/FirstListingStatus";
import { ListingListContainer } from "~/app/@buyer-user/listing/ui/ListingListContainer";

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

	/**
	 * The trick - fetch _any_ listing, so we know, if the app is empty.
	 *
	 * Using collection, because "fetch" throws error on 4o4.
	 */
	const listingQuery = withListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
	});

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
					to={"/$locale/flow/home"}
					params={{
						locale,
					}}
					className={"transition-all"}
				/>
			}
			{...props}
		>
			{listingQuery.data.length > 0 ? (
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

					<ListingListContainer
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
			) : null}

			{listingQuery.data.length > 0 ? null : <FirstListingStatus />}

			<Suspense fallback={null}>
				<FeedEditorSheet
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
			</Suspense>
		</FlowContainer>
	);
};
