// /** biome-ignore-all lint/correctness/noNestedComponentDefinitions: Virtual list component */
import { useParams } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { tvc } from "@use-pico/cls";
import type { tListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import {
	type FC,
	type ReactNode,
	useEffect,
	useId,
	useMemo,
	useRef,
} from "react";
import type { VirtualizerHandle } from "virtua";
import { Virtualizer } from "virtua";
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
	const listingId = useId();

	const listingQuery = withListingCollectionQuery.useSuspenseQuery(query, {
		staleTime: 60_000 * 30,
		refetchOnWindowFocus: true,
	});

	const initialIndex = useMemo(() => {
		if (!scrollToListingId) {
			return 0;
		}

		const idx = listingQuery.data.data.findIndex((listing) => {
			return listing.id === scrollToListingId;
		});

		return idx >= 0 ? idx : 0;
	}, [
		scrollToListingId,
		listingQuery.data,
	]);

	const scrollerRef = useRef<HTMLDivElement | null>(null);
	const virtualizerRef = useRef<VirtualizerHandle | null>(null);

	useEffect(() => {
		if (!scrollToListingId) {
			return;
		}

		if (!virtualizerRef.current) {
			return;
		}

		const index = listingQuery.data.data.findIndex((listing) => {
			return listing.id === scrollToListingId;
		});

		if (index < 0) {
			return;
		}

		virtualizerRef.current.scrollToIndex(index, {
			align: "start",
		});
	}, [
		scrollToListingId,
		listingQuery.data.data,
	]);

	return (
		<Container
			ui="ListingList-root"
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

			{listingQuery.data.data.length > 0 ? (
				<div
					ref={scrollerRef}
					data-ui="ListingList-scroller"
					className={tvc([
						"relative",
						"h-screen",
						"overflow-y-auto",
						"snap-y",
						"snap-mandatory",
						"touch-pan-y",
						"overscroll-contain",
						"[-webkit-overflow-scrolling:touch]",
						"[overflow-anchor:none]",
					])}
				>
					<Virtualizer
						ref={virtualizerRef}
						data={listingQuery.data.data}
						scrollRef={scrollerRef}
						// Rough equivalent of Virtuoso overscan, in pixels
						// bufferSize={200}
						// Keep snapping smooth while scrolling
						onScrollEnd={() => {
							// Hook for any future snapping / analytics needs
						}}
						as="div"
						item="div"
					>
						{(listing) => {
							return (
								<div className="snap-start snap-always">
									<ListingHeroContainer
										key={`${listingId}-${listing.id}`}
										query={query}
										listing={listing}
										toolbar={toolbar}
										imageErrorToolbar={imageErrorToolbar}
										overlay={overlay}
										visible
										height={"viewport"}
									/>
								</div>
							);
						}}
					</Virtualizer>

					{appendix ? (
						<Container
							ui="ListingList-appendix"
							height={"viewport"}
							className="snap-end snap-always"
						>
							{appendix}
						</Container>
					) : null}
				</div>
			) : null}
		</Container>
	);
};
