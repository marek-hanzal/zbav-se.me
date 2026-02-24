import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, useRef } from "react";
import { EmptySuspense } from "./FeedFavouriteListPage/EmptySuspense";
import { FavouriteListAppendix } from "./FeedFavouriteListPage/FavouriteListAppendix";
import { ListingListContainerSuspense } from "~/app/@buyer-user/listing/ui/ListingListContainerSuspense";

export namespace FeedFavouriteListPage {
	export interface Props extends FlowContainer.Props {
		feedId: string;
	}
}

export const FeedFavouriteListPage: FC<FeedFavouriteListPage.Props> = ({ feedId, ...props }) => {
	const locale = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const { sentinelRef, inView: isLast } = useSentinel<HTMLDivElement>({
		containerRef,
		threshold: 0.25,
	});

	return (
		<FlowContainer
			left={
				<LinkTo
					{...uiBackButton({
						ui: {
							opacity: isLast ? "full" : "low",
						},
						className: [],
					})}
					icon={ChevronLeftIcon}
					to={"/$locale/flow/buyer/favourite/list"}
					params={{
						locale,
					}}
					className={"transition-all"}
				/>
			}
			{...props}
		>
			<ListingListContainerSuspense
				ref={containerRef}
				feedId={feedId}
				/**
				 * Don't count score for listings in favourites.
				 */
				withScore={false}
				scrollToId={undefined}
				query={{
					where: {
						feedId,
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
							order: "desc",
						},
					],
				}}
				renderEmptyFn={() => {
					return <EmptySuspense sentinelRef={sentinelRef} />;
				}}
				appendix={<FavouriteListAppendix ref={sentinelRef} />}
			/>
		</FlowContainer>
	);
};
