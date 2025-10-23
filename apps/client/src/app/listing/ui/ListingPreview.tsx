import { Container } from "@use-pico/client";
import type { Gallery, ListingDto } from "@zbav-se.me/sdk";
import { type FC, memo } from "react";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { HeroImage } from "~/app/ui/img/HeroImage";

export namespace ListingPreview {
	export interface Props {
		listing: ListingDto;
		locale: string;
	}
}

export const ListingPreview: FC<ListingPreview.Props> = memo(
	({ locale, listing }) => {
		const [hero] = listing.gallery as [
			Gallery,
			...Gallery[],
		];

		return (
			<Container layout={"vertical-content-footer"}>
				{/* <Title
					textTitle={toHumanNumber({
						number: listing.price,
						locale,
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
						trailingZeroDisplay: "stripIfInteger",
					})}
					// textSubtitle={`${listing.category.name} / ${listing.categoryGroup.name}`}
					right={toTimeDiff({
						time: listing.createdAt,
					})}
				/> */}

				<Container
					tone={"primary"}
					theme={"light"}
					border={"default"}
					shadow={"default"}
					round={"xl"}
				>
					<HeroImage
						src={hero.url}
						alt={`Hero image for listing ${listing.id}`}
						className={"w-full h-full object-cover rounded-xl"}
					/>
				</Container>

				<BottomContainer>yup</BottomContainer>
			</Container>
		);
	},
);
