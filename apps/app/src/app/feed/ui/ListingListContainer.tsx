import { useParams } from "@tanstack/react-router";
import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { type FC, type ReactNode, useEffect, useId, useRef } from "react";
import { ListingHeroContainer } from "~/app/feed/ui/ListingHeroContainer";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToListingId?: string;
		empty?: ReactNode;
		appendix?: ReactNode;
		tools?: ListingHeroContainer.Tools[];
		back?: ReactNode;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	query,
	scrollToListingId,
	empty,
	appendix,
	tools,
	back,
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
			{listingQuery.data.data.length === 0
				? (empty ?? (
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
					))
				: null}

			{listingQuery.data.data.map((listing) => {
				return (
					<ListingHeroContainer
						key={`${listingId}-${listing.id}`}
						containerRef={containerRef}
						query={query}
						listing={listing}
						tools={tools}
						back={back}
					/>
				);
			})}

			{listingQuery.data.data.length > 0 ? appendix : null}
		</Container>
	);
};
