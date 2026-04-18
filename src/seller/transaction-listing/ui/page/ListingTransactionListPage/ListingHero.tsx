import type { FC } from "react";
import { useState } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { ListingSheet } from "~/seller/listing/ui/ListingSheet";

export namespace ListingHero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingHero: FC<ListingHero.Props> = ({ _suspense, listingId, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [isOpen, setIsOpen] = useState(false);
	const hero = useUpload(listing.gallery.items);

	useRenderLogger({
		logger: getRootLogger(),
		name: "ListingHero",
		meta: {
			listingId,
		},
	});

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
