import { Suspense, useState } from "react";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import { useRenderLogger } from "@/lib/client/log";
import { Overlay } from "@/lib/client/overlay";
import { SpinnerContainer } from "@/lib/client/spinner";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { useListingEvent } from "~/buyer/listing/hook/useListingEvent";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";
import { FlagButton } from "../../FlagButton";
import { IgnoreButton } from "../../IgnoreButton";
import { ListingSheet } from "../../ListingSheet";
import { ThumbDislikeButton } from "../../ThumbDislikeButton";
import { ThumbLikeButton } from "../../ThumbLikeButton";

export namespace Item {
	export interface Props extends Container.Props {
		listingId: string;
		feedId: string;
	}
}

export const Item = withFallback(({ listingId, feedId, ...props }: Item.Props) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);
	const [detail, setDetail] = useState<boolean>(false);
	const hero = useUpload(listing.gallery.items);

	useListingEvent({
		enabled: true,
		listingId: listing.id,
		event: "impression",
		timeoutMs: 1_600,
	});

	useRenderLogger({
		logger: getRootLogger(),
		name: "Item",
		meta: {
			listingId,
		},
	});

	return (
		<>
			<Container
				data-id={listing.id}
				data-ui={"Item"}
				data-action={"open listing detail"}
				ui={{
					height: "full",
					width: "full",
					position: "relative",
				}}
				onClick={() => setDetail((prev) => !prev)}
				{...props}
			>
				{listing.isIgnored ? (
					<Overlay
						ui={{
							type: "subtle",
						}}
					/>
				) : null}

				<ListingPrice
					price={listing.price}
					priceType={listing.priceType}
					currency={listing.currency}
					ui={{
						snapTo: "top-center",
						opacity: "8",
						zIndex: true,
					}}
				/>

				<LocationBadge
					location={listing.location}
					distance={listing.distance}
					ui={{
						snapTo: "bottom",
						opacity: "8",
						zIndex: true,
					}}
				/>

				<HeroImage
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					visible
					invisible={<SpinnerContainer />}
				/>
			</Container>

			<ListingSheet
				feedId={feedId}
				listing={listing}
				isOpen={detail}
				onClose={() => setDetail(false)}
			>
				{listing.isIgnored || listing.hasFlag || listing.my ? null : (
					<Container
						ui={{
							layout: "horizontal-flex",
							width: "full",
							items: "center",
							justify: "space-evenly",
						}}
					>
						<Suspense
							fallback={
								<ThumbLikeButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<ThumbLikeButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>
						<Suspense
							fallback={
								<ThumbDislikeButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<ThumbDislikeButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>
					</Container>
				)}

				{listing.isFavourite || listing.thumb === "like" || listing.my ? null : (
					<Group>
						<Suspense
							fallback={
								<IgnoreButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<IgnoreButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>

						<Suspense
							fallback={
								<FlagButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<FlagButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>
					</Group>
				)}
			</ListingSheet>
		</>
	);
}, SpinnerContainer);
