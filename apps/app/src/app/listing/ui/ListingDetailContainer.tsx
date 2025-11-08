import { useParams } from "@tanstack/react-router";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tGallery, tListing } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";
import { HeroImage } from "~/app/ui/img/HeroImage";

export namespace ListingDetailContainer {
	export interface Props extends Container.Props {
		listing: tListing;
	}
}

export const ListingDetailContainer: FC<ListingDetailContainer.Props> = ({
	listing,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const [hero] = listing.gallery as [
		tGallery,
		...tGallery[],
	];

	return (
		<Container
			layout={"vertical-flex"}
			gap={"md"}
			{...props}
		>
			<Container
				height={"content"}
				tone={"primary"}
				theme={"light"}
				border={"default"}
				shadow={"default"}
				round={"md"}
			>
				<HeroImage
					src={hero.upload.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"w-full h-full object-cover rounded-md"}
				/>
			</Container>

			<BadgeValue
				textLabel={"Listing title (label)"}
				textValue={listing.title}
				textValueProps={{
					truncate: false,
					wrap: "wrap",
				}}
			/>

			<BadgeValue
				textLabel={"Listing price (label)"}
				textValue={toLocaleNumber({
					locale,
					number: listing.price,
					currency: listing.currency,
					currencyDisplay: "narrowSymbol",
					style: "currency",
				})}
			/>

			<BadgeValue
				textLabel={"Listing location (label)"}
				textValue={listing.location.address}
				textValueProps={{
					truncate: false,
					wrap: "wrap",
				}}
			/>

			<BadgeValue
				textLabel={"Listing condition (label)"}
				textValue={`Condition - Overall [${listing.condition}] (hint)`}
			/>

			<BadgeValue
				textLabel={"Listing age (label)"}
				textValue={`Condition - Age [${listing.age}] (hint)`}
			/>

			<ContainerValueList
				textTitle={"Listing category (label)"}
				textEmpty={""}
				items={[
					listing.category,
				]}
				render={(item) => {
					return <CategoryInline category={item} />;
				}}
			/>
		</Container>
	);
};
