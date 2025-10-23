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
		const debounceTimeout = 150;

		const { locale } = Route.useParams();
		const { slots } = useCls(ThemeCls);
		const listingQuery = useListingInfiniteQuery({
			size: 2,
		});
		const containerRef = useRef<HTMLDivElement>(null);
		const feedId = useId();
		const debouncedFetchNextPage = useDebouncedCallback(
			(height: number, end: number, position: number) => {
				const trigger = end - height * 2.25;

				if (listingQuery.hasNextPage && position >= trigger) {
					listingQuery.fetchNextPage();
				}
			},
			debounceTimeout,
			{
				maxWait: debounceTimeout * 3,
			},
		);
		const scroller = useRef<ScrollTrigger>(null);

		useAnim(
			() => {
				scroller.current = ScrollTrigger.create({
					scroller: containerRef.current,
					start: 0,
					end: "max",
					onUpdate: (self) => {
						debouncedFetchNextPage(
							containerRef.current?.clientHeight ?? 0,
							self.end,
							self.scroll(),
						);
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
							<FlowContainer
								key={feedId}
								ref={containerRef}
								layout={"vertical-full"}
								snap={"vertical-center"}
								gap={"md"}
								overflow={"vertical"}
							>
								{content}

								{listingQuery.hasNextPage ? null : (
									<Status
										icon={
											"icon-[streamline-ultimate--road-sign-hairpin-turn-left]"
										}
										textTitle={"That's all for now (title)"}
										textMessage={
											"No more listings to show (message)"
										}
									/>
								)}
							</FlowContainer>
						);
					}}
				</InfiniteData>

				<div
					className={slots.default({
						slot: {
							default: {
								class: [
									"absolute",
									"bottom-1",
									"left-2",
									"right-2",
									"h-3",
									"transition-opacity",
									"duration-1500",
									listingQuery.isFetchingNextPage
										? [
												"animate-pulse",
												"opacity-75",
											]
										: "opacity-0",
									"rounded-full",
								],
								token: [
									"border.default",
									"shadow.default",
									"tone.secondary.dark.bg",
									"tone.secondary.dark.border",
									"tone.secondary.dark.shadow",
								],
							},
						},
					})}
				/>
			</Container>
		);
	},
});
