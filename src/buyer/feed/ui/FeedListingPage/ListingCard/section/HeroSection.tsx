import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";
import { FavouriteButton } from "../../FavouriteButton";
import { TransactionButton } from "../../TransactionButton";

export namespace HeroSection {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		listing: ListingSchema.Type;
		onView(view: "gallery"): void;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ feedId, listing, onView }) => {
	const hero = useUpload(listing.gallery.items);
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);

	useRenderLogger({
		logger: getRootLogger(),
		name: "HeroSection",
		meta: {
			listingId: listing.id,
			feedId,
		},
	});

	return (
		<>
			<Container
				data-ui={"HeroSection"}
				ui={{
					position: "relative",
				}}
			>
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

				{listing.my ? null : (
					<FavouriteButton
						_suspense={"I know"}
						feedId={feedId}
						listingId={listing.id}
						iconProps={{
							ui: {
								text: "xl",
							},
						}}
						ui={{
							tone: "secondary",
							theme: "light",
							round: "full",
							square: "md",
							justify: "center",
							items: "center",
							size: undefined,
							inner: undefined,
							snapTo: "top-right",
							zIndex: true,
						}}
						meta={feed.query.meta}
					/>
				)}

				<HeroImage
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					data-action={"open listing gallery"}
					onClick={() => onView("gallery")}
					ui={{
						round: "default",
					}}
					className={"h-64"}
				/>
			</Container>

			{listing.my ? null : <TransactionButton listing={listing} />}
		</>
	);
};
