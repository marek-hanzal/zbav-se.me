import { Suspense, useState } from "react";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import { Overlay } from "@/lib/client/overlay";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useListingEvent } from "~/buyer/listing/~public/useListingEvent";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
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
