import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	Button,
	Container,
	InfiniteData,
	LinkTo,
	Sheet,
	Spinner,
	Status,
} from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { ThemeCls, useAnim } from "@zbav-se.me/ui";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useId, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useListingFeedInfiniteQuery } from "~/app/listing/query/useListingFeedInfiniteQuery";
import { ListingPreview } from "~/app/listing/ui/ListingPreview";

export const Route = createFileRoute("/$locale/buyer/feed/$id")({
	component() {
		const debounceTimeout = 150;

		const { locale, id } = Route.useParams();
		const { slots } = useCls(ThemeCls);
		const listingQuery = useListingFeedInfiniteQuery({
			feedId: id,
			size: 5,
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
			<Container
				data-ui="Feed-root"
				height={"fit"}
			>
				<InfiniteData
					result={listingQuery}
					renderLoading={() => (
						<Container
							ui="Feed-Spinner"
							layout={"vertical-centered"}
							items={"center"}
							height={"fit"}
						>
							<Spinner
								tone="secondary"
								theme={"dark"}
							/>
						</Container>
					)}
					renderFetching={() => <Spinner />}
					renderSuccess={({ data: { pages } }) => {
						if (pages.length === 0) {
							return (
								<Status
									ui="Feed-Status-empty"
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
							<Container
								ui="Feed-Container"
								key={feedId}
								ref={containerRef}
								layout={"vertical-full"}
								snap={"vertical-start"}
							>
								{content}

								{listingQuery.hasNextPage ||
								listingQuery.isFetching ? null : (
									<Sheet>
										<Status
											icon={
												"icon-[streamline-ultimate--road-sign-hairpin-turn-left]"
											}
											textTitle={
												"That's all for now (title)"
											}
											textMessage={
												"No more listings to show (message)"
											}
											action={
												<LinkTo
													to={"/$locale/dashboard"}
													params={{
														locale,
													}}
												>
													<Button
														iconEnabled={
															ArrowLeftIcon
														}
														tone={"secondary"}
														label={
															"Back to home (link)"
														}
													/>
												</LinkTo>
											}
										/>
									</Sheet>
								)}
							</Container>
						);
					}}
				</InfiniteData>

				<div
					className={slots.default({
						slot: {
							default: {
								class: [
									"absolute",
									"-bottom-[5%]",
									"-left-8",
									"-right-8",
									"h-[30%]",
									"pointer-events-none",
									"transition-[opacity,blur]",
									"bg-linear-to-b",
									"duration-750",
									"backdrop-saturate-150",
									"ease-out",
									"border-12",
									"border-white/30",
									"mask-[linear-gradient(to_bottom,transparent,black_92px,black)]",
									listingQuery.isFetchingNextPage
										? [
												"opacity-100",
												"blur-xs",
											]
										: [
												"opacity-0",
												"blur-0",
											],
								],
								token: [
									"tone.primary.light.from",
									"tone.primary.light.to",
								],
							},
						},
					})}
				/>
			</Container>
		);
	},
});
