import { Container, DateInline } from "@use-pico/client";
import type { Gallery, ListingDto } from "@zbav-se.me/sdk";
import type { FC } from "react";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
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
			<Title
				textTitle={listing.location.code}
				// textSubtitle={`${listing.category.name} / ${listing.categoryGroup.name}`}
				right={
					<DateInline
						date={listing.createdAt}
						options={{
							year: "2-digit",
							day: "2-digit",
							month: "narrow",
						}}
					/>
				}
			/>

			<Container
				tone={"primary"}
				theme={"light"}
				border={"default"}
				shadow={"default"}
				round={"lg"}
			>
				<HeroImage
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"w-full h-full object-cover rounded-lg"}
				/>
			</Container>

			<BottomContainer>yup</BottomContainer>
		</Container>
	);
};
