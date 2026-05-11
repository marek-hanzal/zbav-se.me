import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import type { useView } from "@/lib/client/view";
import { translator } from "@/lib/common/translation";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { useUpload } from "~/common/gallery/hook/useUpload";
import type { ListingPriceSchema } from "~/common/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";
import { FavouriteButton } from "../../FavouriteButton";
import { TransactionButton } from "../../TransactionButton";

export namespace HeroSection {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		listing: ListingSchema.Type;
		view: useView.Use<"gallery">;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ feedId, listing, view }) => {
	const hero = useUpload(listing.withImageUrl);
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
				data-ui-position="relative"
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
			>
				{listing.my ? null : (
					<FavouriteButton
						_suspense={"I know"}
						feedId={feedId}
						listingId={listing.id}
						iconProps={{
							"data-ui-text": "xl",
						}}
						data-ui-tone="secondary"
						data-ui-theme="light"
						data-ui-round="full"
						data-ui-square="md"
						data-ui-justify="center"
						data-ui-items="center"
						data-ui-size={undefined}
						data-ui-inner={undefined}
						data-ui-snap-to="top-right"
						data-ui-z-index
						meta={feed.query.meta}
					/>
				)}

				<HeroImage
					src={hero}
					alt={`Hero image for listing ${listing.id}`}
					data-action={"open listing gallery"}
					onClick={() => view.set("gallery")}
					data-ui-round="default"
					className={"h-64"}
				/>

				<Container>
					<Group>
						<LabelValue
							textLabel={translator.text("Listing price (label)")}
							textValue={<ListingPrice price={listing as ListingPriceSchema.Type} />}
						/>

						<LabelValue
							textLabel={translator.text("Listing location (label)")}
							textValue={listing.location.address}
							textValueProps={{
								"data-ui-truncate": false,
								"data-ui-wrap": "wrap",
							}}
						/>
					</Group>
				</Container>
			</Container>

			{listing.my ? null : (
				<TransactionButton
					listing={listing}
					meta={feed.query.meta}
				/>
			)}
		</>
	);
};
