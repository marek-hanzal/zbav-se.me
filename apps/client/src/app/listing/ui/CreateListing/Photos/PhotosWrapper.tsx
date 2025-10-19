import { Container, SnapperNav, Typo, useSnapperNav } from "@use-pico/client";
import { type FC, memo, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { NextButton } from "~/app/listing/ui/CreateListing/NextButton";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

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
		<FlowContainer>
			<ListingProgress />

			<Title
				textTitle={"Listing photos (title)"}
				right={
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
				}
			/>

			<div className={"relative"}>
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
									"opacity-60",
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
			</div>

			<BottomContainer>
				<div />

				<NextButton
					listingNavApi={listingNav.api}
					disabled={!hasPhotos}
				/>
			</BottomContainer>
		</FlowContainer>
	);
});
