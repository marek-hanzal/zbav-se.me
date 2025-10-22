import { createFileRoute } from "@tanstack/react-router";
import { Status } from "@use-pico/client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useId, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useListingInfiniteQuery } from "~/app/listing/query/useListingInfiniteQuery";
import { ListingPreview } from "~/app/listing/ui/ListingPreview";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { InfiniteData } from "~/app/ui/data/InfiniteData";
import { useAnim } from "~/app/ui/gsap";

export const Route = createFileRoute("/$locale/app/feed")({
	component() {
		const listingQuery = useListingInfiniteQuery();
		const containerRef = useRef<HTMLDivElement>(null);
		const feedId = useId();
		const debouncedFetchNextPage = useDebouncedCallback(
			listingQuery.fetchNextPage,
			250,
		);

		useAnim(
			() => {
				ScrollTrigger.create({
					scroller: containerRef.current,
					start: 0,
					end: "max",
					onUpdate: (self) => {
						if (self.progress >= 0.4) {
							debouncedFetchNextPage();
						}
					},
				});
			},
			{
				dependencies: [
					containerRef.current,
				],
			},
		);

		return (
			<InfiniteData
				result={listingQuery}
				renderSuccess={({ data: { pages } }) => {
					if (pages.length === 0) {
						return (
							<Status
								key={`${feedId}-no-listings`}
								icon={"icon-[streamline--sad-face-remix]"}
								textTitle={"No listings (title)"}
								textMessage={"No listings found (message)"}
							/>
						);
					}

					return pages
						.flatMap((p) => p.data)
						.map((listing) => {
							return (
								<ListingPreview
									key={`${feedId}-${listing.id}`}
									listing={listing}
								/>
							);
						});
				}}
			>
				{({ content }) => {
					return (
						<FlowContainer
							key={feedId}
							ref={containerRef}
							layout={"vertical-full"}
							snap={"vertical-center"}
							overflow={"vertical"}
						>
							{content}
						</FlowContainer>
					);
				}}
			</InfiniteData>
		);
	},
});
