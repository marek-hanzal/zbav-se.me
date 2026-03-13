import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListingSheet } from "~/app/v0/@seller/listing/ui/ListingSheet";

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
				data-ui="ListingHero[Container]"
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
					data-ui="ListingHero-[Image]"
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"h-42"}
				/>

				<Container
					data-ui="ListingHero-[TitleOverlay]"
					className={"pointer-events-none"}
					ui={{
						snapTo: "bottom-center",
						width: "full",
						inner: "sm",
						tone: "neutral",
						theme: "light",
						background: "default",
						opacity: "8",
						items: "center",
						zIndex: true,
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
				listing={listing}
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
