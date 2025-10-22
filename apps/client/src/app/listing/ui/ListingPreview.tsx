import { Container } from "@use-pico/client";
import type { Gallery, ListingDto } from "@zbav-se.me/sdk";
import type { FC } from "react";
import { HeroImage } from "~/app/ui/img/HeroImage";
import { Title } from "~/app/ui/title/Title";

export namespace ListingPreview {
	export interface Props {
		listing: ListingDto;
	}
}

export const ListingPreview: FC<ListingPreview.Props> = ({ listing }) => {
	const [hero] = listing.gallery as [
		Gallery,
		...Gallery[],
	];

	return (
		<Container layout={"vertical-header-content-footer"}>
			<Title textTitle={listing.location.address} />

			<HeroImage
				src={hero.url}
				alt={`Hero image for listing ${listing.id}`}
			/>

			<div>footer</div>
		</Container>
	);
};
