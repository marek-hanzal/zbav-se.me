import type { FC } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { Delivery } from "~/buyer-feed/ui/ListingList/Item/Delivery";
import { Distance } from "~/buyer-feed/ui/ListingList/Item/Distance";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import type { ListingPriceSchema } from "~/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/listing/ui/ListingPrice";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { StateType } from "~/ui/type/StateType";
import { Container } from "~/ui/ui/Container";
import { Overlay } from "~/ui/ui/Overlay";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Typo } from "~/ui/ui/Typo";

export namespace Hero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		listingState: StateType.State<boolean>;
	}
}

export const Hero: FC<Hero.Props> = ({ listingId, listingState, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = getUploadFn(listing.withImageUrl);

	return (
		<Container
			data-id={listing.id}
			data-ui={"Item[Container]"}
			//
			data-ui-flow={"vertical"}
			data-ui-height={"full"}
			data-ui-width={"full"}
			data-ui-position={"relative"}
			//
			data-action={"open listing detail"}
			onClick={() => listingState.setFn((prev) => !prev)}
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
