import { Container, SnapperNav, Typo, useSnapperNav } from "@use-pico/client";
import { type FC, memo, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";

export namespace PhotosWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
	}
}

export const PhotosWrapper: FC<PhotosWrapper.Props> = memo(({ listingNav }) => {
	const snapperRef = useRef<HTMLDivElement>(null);
	const useCreateListingStore = useCreateListingContext();
	const photos = useCreateListingStore((store) => store.photos);
	const total = useCreateListingStore((store) => store.photoCountLimit);
	const hasPhotos = useCreateListingStore((store) => store.hasPhotos);
	const selectedCount = photos.filter((photo) => !!photo).length;
	const pages = useSnapperPage();

	const snapperNav = useSnapperNav({
		containerRef: snapperRef,
		orientation: "horizontal",
		count: pages.length,
	});

	return (
		<ListingContainer
			listingNavApi={listingNav.api}
			textTitle={"Listing photos (title)"}
			back={false}
			titleProps={{
				right:
					selectedCount > 0 ? (
						<>
							<Typo
								label={selectedCount}
								font={"bold"}
								display={"inline"}
							/>
							<Typo
								label={"/"}
								display={"inline"}
							/>
							<Typo
								label={total}
								display={"inline"}
							/>
						</>
					) : null,
			}}
			bottom={{
				next: hasPhotos,
			}}
		>
			<SnapperNav
				snapperNav={snapperNav}
				orientation={"horizontal"}
				iconProps={() => ({
					size: "sm",
				})}
				tweak={{
					slot: {
						root: {
							class: [
								"bottom-1",
								"transition-opacity",
								hasPhotos ? "opacity-60" : "opacity-0",
							],
						},
					},
				}}
				subtle={false}
			/>

			<Container
				ref={snapperRef}
				layout="horizontal-full"
				overflow={"horizontal"}
				snap={"horizontal-start"}
				gap={"md"}
				round={"lg"}
			>
				{pages.map((_, slot) => {
					const disabled = slot > 0 && !photos[slot - 1];

					return (
						<PhotoSlot
							key={`photo-${slot + 1}`}
							slot={slot}
							disabled={disabled}
						/>
					);
				})}
			</Container>
		</ListingContainer>
	);
});
