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
import { type FC, forwardRef, type ReactNode, useEffect, useId, useMemo } from "react";
import { List, useListRef } from "react-window";
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

	const listings = listingQuery.data.data;
	const hasAppendix = Boolean(appendix);
	const itemCount = listings.length + (hasAppendix ? 1 : 0);

	const initialIndex = useMemo(() => {
		if (!scrollToListingId) {
			return 0;
		}

		const idx = listings.findIndex((listing) => {
			return listing.id === scrollToListingId;
		});

		return idx >= 0 ? idx : 0;
	}, [
		scrollToListingId,
		listings,
	]);

	const listRef = useListRef(null);

	useEffect(() => {
		if (!scrollToListingId || !listRef.current) {
			return;
		}

		const idx = listings.findIndex((listing) => {
			return listing.id === scrollToListingId;
		});

		if (idx < 0) {
			return;
		}

		listRef.current.scrollToRow({
			index: idx,
			align: "start",
			behavior: "instant",
		});
	}, [
		listRef.current,
		listings,
		scrollToListingId,
	]);

	const hasNoListings = listings.length === 0;

	const OuterElement = useMemo(
		() =>
			forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ className, ...outerProps }, ref) => {
				return (
					<div
						ref={ref}
						data-ui="ListingList-scroller"
						className={tvc([
							"h-dvh",
							"overflow-y-auto",
							"overscroll-contain",
							"[overflow-anchor:none]",
							"[-webkit-overflow-scrolling:touch]",
							"touch-pan-y",
							"snap-y",
							"snap-mandatory",
							className,
						])}
						{...outerProps}
					/>
				);
			}),
		[],
	);

	return (
		<Container
			ui="ListingList-root"
			{...props}
		>
			{hasNoListings
				? (empty ?? (
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
					))
				: null}

			{hasNoListings ? null : (
				<List
					listRef={listRef}
					className={"h-dvh"}
					rowHeight={"100%"}
					rowCount={listingQuery.data.data.length}
					rowProps={{
						listings,
					}}
					rowComponent={({ listings, index, style }) => {
						const listing = listings[index];
						if (!listing) {
							return <div />;
						}

						return (
							<div
								style={style}
								className={tvc([
									"w-full",
									"snap-start",
									"snap-always",
								])}
							>
								<ListingHeroContainer
									key={`${listingIdPrefix}-${listing.id}`}
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
				/>
			)}

			{appendix ? (
				<Container
					ui="ListingList-appendix"
					height={"viewport"}
					// style={style}
					className={tvc([
						"w-full",
						"snap-start",
						"snap-always",
					])}
				>
					{appendix}
				</Container>
			) : null}
		</Container>
	);
};
