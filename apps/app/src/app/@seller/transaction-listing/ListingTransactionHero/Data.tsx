import type { MarkSuspense } from "@use-pico/client/type";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { CloseButton } from "@zbav-se.me/ui/button";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, listingId, ui, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [isOpen, setIsOpen] = useState(false);
	const hero = useUpload(listing.gallery.items);

	return (
		<>
			<Container
				data-ui="ListingTransactionHero[Container]"
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
					data-ui="ListingTransactionHero-[Image]"
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"h-42"}
				/>

				<Container
					data-ui="ListingTransactionHero-[TitleOverlay]"
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

			<BottomSheet
				data-ui="ListingTransactionHero[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				header={({ close }) => ({
					title: listing.title,
					right: <CloseButton onClick={close} />,
				})}
			>
				<Container
					data-ui="ListingTransactionHero-[Placeholder]"
					ui={{
						inner: "default",
					}}
				>
					<Typo
						label={listing.title}
						ui={{
							opacity: "7",
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
