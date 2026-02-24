import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, Suspense, useRef } from "react";
import { Empty } from "~/app/@buyer-user/feed/page/feed-favourite-list-page/Empty";
import { EmptyPending } from "~/app/@buyer-user/feed/page/feed-favourite-list-page/EmptyPending";
import { FavouriteListAppendix } from "~/app/@buyer-user/feed-favourite/ui/FavouriteListAppendix";
import { ListingListContainer } from "~/app/@buyer-user/listing/ui/ListingListContainer";

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
			<ListingListContainer
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
					return (
						<Suspense fallback={<EmptyPending />}>
							<Empty
								_suspense={"I know"}
								sentinelRef={sentinelRef}
							/>
						</Suspense>
					);
				}}
				appendix={<FavouriteListAppendix ref={sentinelRef} />}
			/>
		</FlowContainer>
	);
};
