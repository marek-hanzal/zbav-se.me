import { Container } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";
import { Title } from "~/app/ui/title/Title";

export const PhotosWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const photos = useCreateListingStore((store) => store.photos);
	const pages = useSnapperPage();

	return (
		<Container
			position={"relative"}
			square={"md"}
			round={"lg"}
		>
			<Container
				layout={"vertical-header-content-footer"}
				gap={"sm"}
			>
				<Container>
					<Title title={"Listing photos (title)"} />
				</Container>

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

				<Container
					tone={"primary"}
					theme={"light"}
					round={"lg"}
					square={"md"}
				>
					hovno
				</Container>
			</Container>
		</Container>
	);
};
