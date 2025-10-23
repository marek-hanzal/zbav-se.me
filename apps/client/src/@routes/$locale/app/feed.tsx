import { createFileRoute } from "@tanstack/react-router";
import { Container, Status } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useId, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useListingInfiniteQuery } from "~/app/listing/query/useListingInfiniteQuery";
import { ListingPreview } from "~/app/listing/ui/ListingPreview";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { InfiniteData } from "~/app/ui/data/InfiniteData";
import { useAnim } from "~/app/ui/gsap";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const Route = createFileRoute("/$locale/app/feed")({
	component() {
		const { locale } = Route.useParams();
		const { slots } = useCls(ThemeCls);
		const listingQuery = useListingInfiniteQuery();
		const containerRef = useRef<HTMLDivElement>(null);
		const feedId = useId();
		const debouncedFetchNextPage = useDebouncedCallback(
			listingQuery.fetchNextPage,
			150,
		);
		const scroller = useRef<ScrollTrigger>(null);

		useAnim(
			() => {
				scroller.current = ScrollTrigger.create({
					scroller: containerRef.current,
					start: 0,
					end: "max",
					onUpdate: (self) => {
						if (self.progress >= 0.45) {
							debouncedFetchNextPage();
						}
					},
				});
			},
			{
				dependencies: [],
			},
		);

		useEffect(() => {
			scroller.current?.refresh();
		}, [
			listingQuery.data,
		]);

		return (
			<Container position={"relative"}>
				<PrimaryOverlay />

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
										locale={locale}
									/>
								);
							});
					}}
				>
					{({ content }) => {
						return (
							<>
								<FlowContainer
									key={feedId}
									ref={containerRef}
									layout={"vertical-full"}
									snap={"vertical-center"}
									overflow={"vertical"}
								>
									{content}
								</FlowContainer>

								{listingQuery.isFetchingNextPage ? (
									<div
										className={slots.default({
											slot: {
												default: {
													class: [
														"absolute",
														"bottom-1",
														"left-2",
														"right-2",
														"h-2",
														"animate-pulse",
														"opacity-50",
														"rounded-4xl",
													],
													token: [
														"tone.primary.dark.bg",
													],
												},
											},
										})}
									/>
								) : null}
							</>
						);
					}}
				</InfiniteData>
			</Container>
		);
	},
});
