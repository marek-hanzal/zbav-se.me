import { createFileRoute } from "@tanstack/react-router";
import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFavouriteCountQuery } from "@zbav-se.me/sdk/query/buyer-user/favourite";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";
import { EmptyFavouriteStatus } from "~/app/@buyer-user/feed-favourite/ui/EmptyFavouriteStatus";
import { EmptyFeedStatus } from "~/app/@buyer-user/feed-favourite/ui/EmptyFeedStatus";
import { FavouriteListAppendix } from "~/app/@buyer-user/feed-favourite/ui/FavouriteListAppendix";
import { ListingListContainer } from "~/app/@buyer-user/listing/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/flow/buyer/feed/$id/favourite/list")({
	component() {
		const { id } = Route.useParams();
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
			>
				<ListingListContainer
					ref={containerRef}
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
								order: "desc",
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
										return <EmptyFavouriteStatus ref={sentinelRef} />;
									}

									return <EmptyFeedStatus ref={sentinelRef} />;
								}}
							</withFavouriteCountQuery.Suspense>
						);
					}}
					appendix={<FavouriteListAppendix ref={sentinelRef} />}
				/>
			</FlowContainer>
		);
	},
});
