// /** biome-ignore-all lint/correctness/noNestedComponentDefinitions: Virtual list component */
import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { tvc } from "@use-pico/cls";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, type ReactNode, useEffect, useId, useMemo, useRef } from "react";
import { ListingHeroContainer } from "~/app/listing/ui/ListingHeroContainer";

export namespace ListingListContainer {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToListingId?: string;
		empty?: ReactNode;
		appendix?: ReactNode;
		toolbar: ListingHeroContainer.Toolbar.RenderFn;
		renderImageErrorToolbarFn: ListingHeroContainer.Toolbar.RenderFn;
		overlay: ListingHeroContainer.Overlay.Render;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	_suspense,
	locale,
	query,
	scrollToListingId,
	empty,
	appendix,
	toolbar,
	renderImageErrorToolbarFn,
	overlay,
	...props
}) => {
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
			className={tvc([
				"isolate",
				"overflow-x-clip",
				"overscroll-contain",
				"contain-strict",
				"will-change-scroll",
			])}
			{...props}
		>
			{hasListings ? null : emptySlot}

			{hasListings
				? listingQuery.data.data.map((listing) => (
						<VisibleContainer
							key={`${listingIdPrefix}-${listing.id}`}
							scrollerRef={containerRef}
							useProximity
							delay={200}
							placeholder={(props) => (
								<SpinnerContainer
									ui="ListingList-spinner"
									data-id={listing.id}
									{...props}
								/>
							)}
							className={tvc([
								"[content-visibility:auto]",
								"[contain-intrinsic-size:100dvh]",
							])}
						>
							<ListingHeroContainer
								query={query}
								listing={listing}
								toolbar={toolbar}
								renderImageErrorToolbarFn={renderImageErrorToolbarFn}
								overlay={overlay}
							/>
						</VisibleContainer>
					))
				: null}

			{appendix}
		</Container>
	);
};
