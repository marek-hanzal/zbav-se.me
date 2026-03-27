import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { FC } from "react";
import { useState } from "react";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { HeroImage } from "~/common/ui/img";
import { ListingSheet } from "~/seller/listing/~public/ListingSheet";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";

export namespace ListingHero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingHero: FC<ListingHero.Props> = ({ _suspense, listingId, ui, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [isOpen, setIsOpen] = useState(false);
	const hero = useUpload(listing.gallery.items);

	return (
		<>
			<Container
				data-ui="ListingHero"
				ui={{
					position: "relative",
					height: "content",
					...ui,
				}}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<HeroImage
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"h-42"}
				/>

				<ListingPrice
					price={listing.price}
					priceType={listing.priceType}
					currency={listing.currency}
					ui={{
						tone: "neutral",
						theme: "light",
						snapTo: "top-center",
					}}
				/>

				<Container
					className={"pointer-events-none"}
					ui={{
						snapTo: "bottom-center",
						inner: "default",
						tone: "neutral",
						theme: "light",
						background: "default",
						opacity: "8",
						items: "center",
						zIndex: true,
						width: "full",
					}}
				>
					<Typo
						label={listing.title}
						ui={{
							tone: "neutral",
							theme: "light",
							color: "text",
							font: "bold",
							display: "block",
							width: "full",
						}}
						className={[
							"line-clamp-2",
							"text-center",
						]}
					/>
				</Container>
			</Container>

			<ListingSheet
				_suspense={"I know"}
				listing={listing}
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
