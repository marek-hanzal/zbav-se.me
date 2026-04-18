import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Overlay } from "@/lib/client/overlay";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { HeroImage } from "~/common/ui/img";
import { Distance } from "./Distance";
import { Price } from "./Price";

export namespace Hero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		listingState: StateType.State<boolean>;
	}
}

export const Hero: FC<Hero.Props> = ({ listingId, listingState, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.gallery.items);

	return (
		<Container
			data-id={listing.id}
			data-ui={"Item"}
			//
			data-ui-flow={"vertical"}
			data-ui-height={"full"}
			data-ui-width={"full"}
			//
			data-action={"open listing detail"}
			onClick={() => listingState.set((prev) => !prev)}
			{...props}
		>
			{listing.isIgnored ? <Overlay data-ui-type="subtle" /> : null}

			<HeroImage
				src={hero.url}
				alt={`Hero image for listing ${listing.id}`}
				visible
				invisible={<SpinnerContainer />}
			/>

			<Container
				data-ui-flow={"vertical"}
				data-ui-inner={"sm"}
			>
				<Container
					data-ui-flow="horizontal"
					data-ui-justify="space-between"
					data-ui-items="center"
					data-ui-gap="default"
				>
					<Typo
						label={listing.title}
						data-ui-tone="brand"
						data-ui-theme="light"
						data-ui-font="bold"
						data-ui-color="lead"
						data-ui-text="sm"
					/>

					<Distance distance={listing.distance} />
				</Container>

				<Price
					price={listing.price}
					type={listing.priceType}
					currency={listing.currency}
				/>
			</Container>
		</Container>
	);
};
