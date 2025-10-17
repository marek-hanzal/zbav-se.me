import { Button, Container, Typo, type useSnapperNav } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { CategoryGroupIcon } from "~/app/ui/icon/CategoryGroupIcon";
import { Title } from "~/app/ui/title/Title";

export namespace PhotosWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
	}
}

export const PhotosWrapper: FC<PhotosWrapper.Props> = ({ listingNav }) => {
	const useCreateListingStore = useCreateListingContext();
	const photos = useCreateListingStore((store) => store.photos);
	const total = useCreateListingStore((store) => store.photoCountLimit);
	const selectedCount = photos.filter((photo) => !!photo).length;
	const pages = useSnapperPage();

	return (
		<FlowContainer>
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
				<div>left</div>

				<div>
					<Button
						iconEnabled={CategoryGroupIcon}
						iconPosition={"right"}
						label={"Next - Category group (button)"}
						tone={"secondary"}
						theme={"light"}
						onClick={() => listingNav.next()}
					/>
				</div>
			</BottomContainer>
		</FlowContainer>
	);
};
