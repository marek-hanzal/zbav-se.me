import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { Overlay } from "@use-pico/client/ui/overlay";
import { withFallback } from "@use-pico/client/utils";
import { HeroImage } from "@zbav-se.me/ui/img";
import { Suspense, useState } from "react";
import { useListingEvent } from "~/client/@buyer/listing/~public/useListingEvent";
import { withListingQuery } from "~/client/@buyer/listing/withListingQuery";
import { useUpload } from "~/client/@common/gallery/hook/useUpload";
import { ListingPrice } from "~/client/@common/listing/ui/ListingPrice";
import { LocationBadge } from "~/client/@common/location/ui/LocationBadge";
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
	const [detail, setDetail] = useState<boolean>(false);
	const hero = useUpload(listing.gallery.items);

	useListingEvent({
		enabled: true,
		listingId: listing.id,
		event: "impression",
		timeoutMs: 1_600,
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
				{listing.isIgnored ? <Overlay type={"subtle"} /> : null}

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
						<Suspense fallback={<ThumbLikeButton.Fallback listingId={listingId} />}>
							<ThumbLikeButton
								_suspense={"I know"}
								listingId={listingId}
							/>
						</Suspense>
						<Suspense fallback={<ThumbDislikeButton.Fallback listingId={listingId} />}>
							<ThumbDislikeButton
								_suspense={"I know"}
								listingId={listingId}
							/>
						</Suspense>
					</Container>
				)}

				{listing.isFavourite || listing.thumb === "like" || listing.my ? null : (
					<Group>
						<Suspense fallback={<IgnoreButton.Fallback listingId={listingId} />}>
							<IgnoreButton
								_suspense={"I know"}
								listingId={listingId}
							/>
						</Suspense>

						<Suspense fallback={<FlagButton.Fallback listingId={listingId} />}>
							<FlagButton
								_suspense={"I know"}
								listingId={listingId}
							/>
						</Suspense>
					</Group>
				)}
			</ListingSheet>
		</>
	);
}, SpinnerContainer);
