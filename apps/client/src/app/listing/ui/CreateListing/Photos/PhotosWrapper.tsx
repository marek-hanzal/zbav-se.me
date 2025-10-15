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
				orientation="horizontal"
				iconProps={() => ({
					size: "xs",
				})}
				limit={5}
				tweak={{
					slot: {
						root: {
							class: [
								"bg-white/0",
							],
						},
					},
				}}
			/>

			<Container
				ref={containerRef}
				layout="horizontal-full"
				overflow={"horizontal"}
				snap={"horizontal-start"}
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
