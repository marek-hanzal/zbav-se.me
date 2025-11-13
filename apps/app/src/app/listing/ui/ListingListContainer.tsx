/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: Virtuoso is a nested component */
import { useParams } from "@tanstack/react-router";
import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import {
	type FC,
	type ReactNode,
	type Ref,
	useEffect,
	useId,
	useRef,
} from "react";
import { Virtuoso } from "react-virtuoso";
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

			<Virtuoso
				data={listingQuery.data.data}
				overscan={5}
				components={{
					ScrollSeekPlaceholder() {
						return <SpinnerContainer height={"viewport"} />;
					},
					Scroller({ ref, context: __, ...props }) {
						return (
							<div
								ref={ref as Ref<HTMLDivElement> | undefined}
								className={
									"snap-y snap-mandatory overscroll-contain"
								}
								{...props}
							/>
						);
					},
					Item({ item: _, context: __, ...props }) {
						return (
							<div
								className={"snap-start"}
								{...props}
							/>
						);
					},
					Footer() {
						return listingQuery.data.data.length > 0 ? (
							<Container
								ui="ListingList-appendix"
								height={"viewport"}
							>
								{appendix}
							</Container>
						) : null;
					},
				}}
				scrollSeekConfiguration={{
					enter(velocity) {
						return Math.abs(velocity) > 650;
					},
					exit(velocity) {
						return Math.abs(velocity) < 50;
					},
				}}
				itemContent={(_, listing) => {
					return (
						<ListingHeroContainer
							key={`${listingId}-${listing.id}`}
							containerRef={containerRef}
							query={query}
							listing={listing}
							toolbar={toolbar}
							imageErrorToolbar={imageErrorToolbar}
							overlay={overlay}
							visible
							height={"viewport"}
						/>
					);
				}}
			/>
		</Container>
	);
};
