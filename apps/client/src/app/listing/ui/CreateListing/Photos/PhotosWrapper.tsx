import {
	ArrowRightIcon,
	Button,
	Container,
	Typo,
	type useSnapperNav,
} from "@use-pico/client";
import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export namespace PhotosWrapper {
	export interface Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const PhotosWrapper: FC<PhotosWrapper.Props> = memo(
	({ listingNavApi }) => {
		const useCreateListingStore = useCreateListingContext();
		const photos = useCreateListingStore((store) => store.photos);
		const total = useCreateListingStore((store) => store.photoCountLimit);
		const hasPhotos = useCreateListingStore((store) => store.hasPhotos);
		const selectedCount = photos.filter((photo) => !!photo).length;
		const pages = useSnapperPage();

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

				<Container
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

				<BottomContainer>
					<div />

					<Button
						iconEnabled={ArrowRightIcon}
						iconPosition={"right"}
						disabled={!hasPhotos}
						tone={"secondary"}
						theme={"dark"}
						onClick={listingNavApi.next}
						size={"lg"}
					/>
				</BottomContainer>
			</FlowContainer>
		);
	},
);
