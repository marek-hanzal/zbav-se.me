import { useParams } from "@tanstack/react-router";
import { useAnim } from "@use-pico/client/gsap";
import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Spinner } from "@use-pico/client/ui/spinner";
import { Status } from "@use-pico/client/ui/status";
import { withListingFeedCollectionQuery } from "@zbav-se.me/sdk/query";
import { Sheet } from "@zbav-se.me/ui/sheet";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
	type FC,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { ListingHeroContainer } from "~/app/feed/ui/ListingHeroContainer";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
		/**
		 * Listing ID to scroll to
		 */
		scrollToListingId?: string;
		/**
		 * Feed id listing is part of
		 */
		id: string;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	id,
	scrollToListingId,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const feedId = useId();

	const listingQuery = withListingFeedCollectionQuery({
		feedId: id,
		size: 200,
		where: {
			withOwn: false,
			withIgnored: false,
		},
	}).useQuery(
		{},
		{
			staleTime: 60_000 * 30,
			refetchInterval: 60_000,
			refetchOnWindowFocus: true,
		},
	);
	const containerRef = useRef<HTMLDivElement>(null);
	const visiblesRef = useRef<Set<string>>(new Set<string>());
	const [visibles, setVisibles] = useState(() => new Set<string>());

	const schedule = useCallback(
		(elements: HTMLElement[], isVisible: boolean) => {
			elements.forEach((element) => {
				const id = element.dataset.id;
				if (!id) {
					return;
				}

				if (isVisible) {
					visiblesRef.current.add(id);
				} else {
					visiblesRef.current.delete(id);
				}
			});

			/**
			 * We've to immediately set the visibles set or timeout may trigger false visibility and send score event when
			 * it should not.
			 */
			setVisibles(() => {
				return new Set<string>(visiblesRef.current);
			});
		},
		[],
	);

	useAnim(
		() => {
			ScrollTrigger.batch(".ListingPreview-root", {
				scroller: containerRef.current,
				start: "top bottom",
				end: "bottom top",
				onEnter(self) {
					schedule(self as HTMLElement[], true);
				},
				onEnterBack(self) {
					schedule(self as HTMLElement[], true);
				},
				onLeave(self) {
					schedule(self as HTMLElement[], false);
				},
				onLeaveBack(self) {
					schedule(self as HTMLElement[], false);
				},
			});
		},
		{
			scope: containerRef,
			dependencies: [
				listingQuery.data,
			],
		},
	);

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
			ui="Feed-root"
			height={"fit"}
			{...props}
		>
			<Data
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
				renderSuccess={({ data: { data } }) => {
					if (data.length === 0) {
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

					return data.map((listing) => {
						return (
							<ListingHeroContainer
								key={`${feedId}-${listing.id}`}
								feedId={id}
								listing={listing}
								locale={locale}
								isVisible={visibles.has(listing.id)}
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

							{listingQuery.isFetching ||
							listingQuery.data?.data?.length ? null : (
								<Sheet round={"unset"}>
									<Status
										icon={
											"icon-[streamline-ultimate--road-sign-hairpin-turn-left]"
										}
										textTitle={"That's all for now (title)"}
										textMessage={
											"No more listings to show (message)"
										}
										action={
											<LinkTo
												to={
													"/$locale/buyer/feed/select"
												}
												params={{
													locale,
												}}
											>
												<Button
													iconEnabled={ArrowLeftIcon}
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
			</Data>
		</Container>
	);
};
