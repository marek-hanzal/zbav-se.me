import { Container, Tx, Typo } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/Slot/PhotoSlot";
import { useSnapperPage } from "~/app/listing/ui/CreateListing/Photos/useSnapperPage";

export const PhotosWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const photos = useCreateListingStore((store) => store.photos);
	const total = useCreateListingStore((store) => store.photoCountLimit);
	const selectedCount = photos.filter((photo) => !!photo).length;
	const pages = useSnapperPage();

	return (
		<Container
			layout={"vertical-header-content-footer"}
			tone={"secondary"}
			theme={"light"}
			square={"md"}
			gap={"xs"}
		>
			<Container
				tone={"primary"}
				theme={"light"}
				round={"lg"}
				square={"md"}
				border={"default"}
				shadow={"default"}
				tweak={{
					slot: {
						root: {
							class: [
								"inline-flex",
								"items-center",
								"justify-between",
								"gap-xs",
							],
						},
					},
				}}
			>
				<Tx
					label={"Listing photos (title)"}
					font={"bold"}
					size={"md"}
				/>

				<div className="inline-flex flex-row gap-1 items-center">
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
				</div>
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
				border={"default"}
			>
				hovno
			</Container>
		</Container>
	);
};
