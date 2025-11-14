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
import { type FC, type ReactNode, useId } from "react";
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

	// useLayoutEffect(() => {
	// 	if (!scrollToListingId) {
	// 		return;
	// 	}

	// 	if (!listingQuery.data.data.length) {
	// 		return;
	// 	}

	// 	const index = listingQuery.data.data.findIndex((listing) => {
	// 		return listing.id === scrollToListingId;
	// 	});

	// 	if (index < 0) {
	// 		return;
	// 	}
	// }, [
	// 	scrollToListingId,
	// 	listingQuery.data.data,
	// ]);

	return (
		<Container
			ui="ListingList-root"
			{...props}
		>
			{listingQuery.data.data.length
				? null
				: (empty ?? (
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
					))}

			{listingQuery.data.data.length ? (
				<div
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
					])}
				>
					{listingQuery.data.data.map((listing) => {
						return (
							<ListingHeroContainer
								key={`${listingIdPrefix}-${listing.id}`}
								query={query}
								listing={listing}
								toolbar={toolbar}
								imageErrorToolbar={imageErrorToolbar}
								overlay={overlay}
								visible
								height={"viewport"}
								className={tvc([
									"w-full",
									"snap-start",
									"snap-always",
								])}
							/>
						);
					})}

					{appendix ? (
						<Container
							ui="ListingList-appendix"
							height={"viewport"}
							className="snap-start snap-always"
						>
							{appendix}
						</Container>
					) : null}
				</div>
			) : null}
		</Container>
	);
};
