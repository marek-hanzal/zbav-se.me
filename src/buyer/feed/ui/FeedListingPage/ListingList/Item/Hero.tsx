import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Overlay } from "@/lib/client/overlay";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import type { ListingPriceSchema } from "~/common/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { HeroImage } from "~/common/ui/img";
import { Delivery } from "./Delivery";
import { Distance } from "./Distance";

export namespace Hero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		listingState: StateType.State<boolean>;
	}
}

export const Hero: FC<Hero.Props> = ({ listingId, listingState, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.withImageUrl);

	return (
		<Container
			data-id={listing.id}
			data-ui={"Item"}
			//
			data-ui-flow={"vertical"}
			data-ui-height={"full"}
			data-ui-width={"full"}
			data-ui-position={"relative"}
			//
			data-action={"open listing detail"}
			onClick={() => listingState.set((prev) => !prev)}
			{...props}
		>
			{listing.isIgnored ? <Overlay data-ui-type="subtle" /> : null}

			<HeroImage
				src={hero}
				alt={`Hero image for listing ${listing.id}`}
				visible
				invisible={<SpinnerContainer />}
			/>

			<Container
				data-ui-flow={"vertical"}
				data-ui-inner={"sm"}
				data-ui-snap-to={"bottom-center"}
				data-ui-tone={"neutral"}
				data-ui-theme={"light"}
				data-ui-background={"default"}
				data-ui-width={"full"}
				data-ui-opacity={"8"}
				className={[
					"bottom-0",
				]}
			>
				<Container
					data-ui-flow="horizontal"
					data-ui-justify="space-between"
					data-ui-items="center"
					data-ui-gap="default"
				>
					<Typo
						label={listing.title}
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-font="semibold"
						data-ui-color="lead"
						data-ui-text="default"
						data-ui-truncate
					/>

					<Distance distance={listing.distance} />
				</Container>

				<Container
					data-ui-flow={"horizontal"}
					data-ui-justify={"space-between"}
				>
					<ListingPrice price={listing as ListingPriceSchema.Type} />

					<Delivery delivery={listing.delivery} />
				</Container>
			</Container>
		</Container>
	);
};
