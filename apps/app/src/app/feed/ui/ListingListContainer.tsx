import { useParams } from "@tanstack/react-router";
import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { Sheet } from "@zbav-se.me/ui/sheet";
import { type FC, useEffect, useId, useRef } from "react";
import { ListingHeroContainer } from "~/app/feed/ui/ListingHeroContainer";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToListingId?: string;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	query,
	scrollToListingId,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const listingId = useId();

	const listingQuery = withListingCollectionQuery.useSuspenseQuery(query, {
		staleTime: 60_000 * 30,
		refetchOnWindowFocus: true,
	});
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollTo = useScrollTo(containerRef);

	useEffect(() => {
		if (scrollToListingId) {
			scrollTo(`.ListingPreview-${scrollToListingId}`, {
				behavior: "instant",
			});
		}
	}, [
		scrollToListingId,
		scrollTo,
	]);

	return (
		<Container
			ref={containerRef}
			ui="Feed-root"
			layout={"vertical-full"}
			snap={"vertical-start"}
			{...props}
		>
			{listingQuery.data.data.length === 0 ? (
				<Status
					ui="ListingList-empty"
					key={`${listingId}-no-listings`}
					icon={"icon-[streamline--sad-face-remix]"}
					textTitle={"No listings (title)"}
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
			) : null}

			{listingQuery.data.data.map((listing) => {
				return (
					<ListingHeroContainer
						key={`${listingId}-${listing.id}`}
						containerRef={containerRef}
						query={query}
						listing={listing}
						locale={locale}
					/>
				);
			})}

			{listingQuery.data.data.length > 0 ? (
				<Sheet round={"unset"}>
					<Status
						icon={
							"icon-[streamline-ultimate--road-sign-hairpin-turn-left]"
						}
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
			) : null}
		</Container>
	);
};
