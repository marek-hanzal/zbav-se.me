import { useParams } from "@tanstack/react-router";
import { useAnim } from "@use-pico/client/gsap";
import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
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
		 * Feed id listing is part of
		 */
		feedId: string;
		/**
		 * Listing ID to scroll to
		 */
		scrollToListingId?: string;
		/**
		 * Limit max. number of listings to fetch.
		 */
		limit: number;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	scrollToListingId,
	feedId,
	limit,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const listingId = useId();

	const listingQuery = withListingFeedCollectionQuery({
		feedId: feedId,
		size: limit,
		where: {
			withOwn: false,
			withIgnored: false,
		},
	}).useSuspenseQuery(
		{},
		{
			staleTime: 60_000 * 30,
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
			<Container
				ui="Feed-Container"
				key={listingId}
				ref={containerRef}
				layout={"vertical-full"}
				snap={"vertical-start"}
			>
				{listingQuery.data.data.length === 0 ? (
					<Status
						ui="Feed-Status-empty"
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
				) : null}

				{listingQuery.data.data.map((listing) => {
					return (
						<ListingHeroContainer
							key={`${listingId}-${listing.id}`}
							feedId={feedId}
							limit={limit}
							listing={listing}
							locale={locale}
							isVisible={visibles.has(listing.id)}
						/>
					);
				})}

				{listingQuery.data.data.length > 0 ? (
					<Sheet round={"unset"}>
						<Status
							icon={
								"icon-[streamline-ultimate--road-sign-hairpin-turn-left]"
							}
							textTitle={"That's all for now (title)"}
							textMessage={"No more listings to show (message)"}
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
					</Sheet>
				) : null}
			</Container>
		</Container>
	);
};
