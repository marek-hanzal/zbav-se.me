import { Container, Typo } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export const PhotosWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const photos = useCreateListingStore((store) => store.photos);
	const total = useCreateListingStore((store) => store.photoCountLimit);
	const selectedCount = photos.filter((photo) => !!photo).length;
	const pages = useSnapperPage();

	return (
		<FlowContainer>
			<Title
				title={"Listing photos (title)"}
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

			<BottomContainer>hovno</BottomContainer>
		</FlowContainer>
	);
};
