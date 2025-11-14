// /** biome-ignore-all lint/correctness/noNestedComponentDefinitions: Virtual list component */
import { useParams } from "@tanstack/react-router";
import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import { type FC, type ReactNode, useEffect, useId, useMemo, useRef } from "react";
import { ListingHeroContainer } from "~/app/listing/ui/ListingHeroContainer";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToListingId?: string;
		empty?: ReactNode;
		appendix?: ReactNode;
		toolbar: ListingHeroContainer.Toolbar.Render;
		imageErrorToolbar: ListingHeroContainer.Toolbar.Render;
		overlay: ListingHeroContainer.Overlay.Render;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	query,
	scrollToListingId,
	empty,
	appendix,
	toolbar,
	imageErrorToolbar,
	overlay,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const listingIdPrefix = useId();

	const listingQuery = withListingCollectionQuery.useSuspenseQuery(query, {
		staleTime: 60_000 * 30,
		refetchOnWindowFocus: true,
	});

	const containerRef = useRef<HTMLDivElement>(null);

	const scrollTo = useScrollTo(containerRef);

	const hasListings = listingQuery.data.data.length > 0;

	useEffect(() => {
		if (!scrollToListingId || !containerRef.current) {
			return;
		}
		scrollTo(`[data-id="${scrollToListingId}"]`, {
			behavior: "instant",
		});
	}, [
		scrollToListingId,
		scrollTo,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We don't care about changing "empty" props
	const emptySlot = useMemo(() => {
		return (
			empty ?? (
				<Status
					ui="ListingList-empty"
					key={`${listingIdPrefix}-no-listings`}
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
			)
		);
	}, [
		locale,
	]);

	return (
		<Container
			ref={containerRef}
			ui="ListingList-root"
			layout={"vertical-full"}
			snap={"vertical-start"}
			{...props}
		>
			{hasListings ? null : emptySlot}

			{hasListings
				? listingQuery.data.data.map((listing) => (
						<VisibleContainer
							key={`${listingIdPrefix}-${listing.id}`}
                            scrollerRef={containerRef}
							useProximity
							delay={0}
							placeholder={(props) => (
								<SpinnerContainer
									ui="ListingList-spinner"
									data-id={listing.id}
									{...props}
								/>
							)}
						>
							<ListingHeroContainer
								query={query}
								listing={listing}
								toolbar={toolbar}
								imageErrorToolbar={imageErrorToolbar}
								overlay={overlay}
							/>
						</VisibleContainer>
					))
				: null}

			{appendix}
		</Container>
	);
};
