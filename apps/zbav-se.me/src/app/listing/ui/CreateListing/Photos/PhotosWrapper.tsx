import { Container, SnapperNav } from "@use-pico/client";
import { type FC, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";

export const PhotosWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const photos = useCreateListingStore((store) => store.photos);
	const pages = useSnapperPage();

	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container position={"relative"}>
			<SnapperNav
				containerRef={containerRef}
				pages={pages}
				orientation="vertical"
				iconProps={() => ({
					size: "xs",
				})}
			/>

			<Container
				ref={containerRef}
				layout="vertical-full"
				overflow={"vertical"}
				snap={"vertical-start"}
				gap={"md"}
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
		</Container>
	);
};
