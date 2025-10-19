import { useMutation } from "@tanstack/react-query";
import {
	Button,
	Container,
	Icon,
	Progress,
	Status,
	type useSnapperNav,
} from "@use-pico/client";
import { linkTo } from "@use-pico/common";
import { upload } from "@vercel/blob/client";
import PQueue from "p-queue";
import type { FC } from "react";
import { memo, useId, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import type { createListingStore } from "~/app/listing/store/createListingStore";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { ListingPageIndex } from "~/app/listing/ui/CreateListing/ListingPageIndex";
import { Sheet } from "~/app/sheet/Sheet";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";
import { Title } from "~/app/ui/title/Title";

const IconMap = ListingPageIndex.Page;

export const SubmitWrapper: FC<{
	listingNavApi: useSnapperNav.Api;
}> = memo(({ listingNavApi }) => {
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);
	const photos = useCreateListingStore((store) => store.photos);
	const missingId = useId();
	const files = photos.filter((photo) => !!photo);

	// Track progress for each photo individually
	const [photoProgress, setPhotoProgress] = useState<Record<string, number>>(
		{},
	);

	const uploadContentMutation = useMutation<any, Error, File[]>({
		mutationKey: [
			"content",
			"upload",
		],
		async mutationFn(photos) {
			// Reset progress state
			setPhotoProgress({});

			const queue = new PQueue({
				concurrency: 3,
			});

			const uploadPromises = photos.map(async (photo) => {
				return queue.add(() =>
					upload(photo.name, photo, {
						access: "public",
						contentType: photo.type,
						handleUploadUrl: linkTo({
							base: import.meta.env.VITE_API,
							href: "/api/content/upload",
						}),
						onUploadProgress({ percentage }) {
							setPhotoProgress((prev) => ({
								...prev,
								[photo.name]: percentage,
							}));
						},
						multipart: true,
					}),
				);
			});

			// Wait for all uploads to complete
			return Promise.all(uploadPromises);
		},
	});

	if (missing.length > 0) {
		return (
			<ListingContainer listingNavApi={listingNavApi}>
				<Title
					tone={"primary"}
					textTitle="Submit - one more thing (title)"
				/>

				<Sheet
					tone={"primary"}
					theme={"light"}
				>
					<Status
						icon={SendPackageIcon}
						tone={"primary"}
						theme={"light"}
						textTitle="Submit listing - status - cannot submit (title)"
						textMessage={
							"Submit listing - status - cannot submit (message)"
						}
						action={
							<Container
								layout={"horizontal-full"}
								overflow={"horizontal"}
							>
								<div className="flex flex-row items-center justify-center gap-2 w-fit mx-auto">
									{Object.entries(IconMap).map(
										([key, { index, icon }]) => {
											return missing.includes(
												key as createListingStore.Missing,
											) ? (
												<Icon
													key={`${missingId}-${key}`}
													icon={icon}
													tone={"secondary"}
													size={"xl"}
													onClick={() => {
														listingNavApi.snapTo(
															index,
														);
													}}
												/>
											) : null;
										},
									)}
								</div>
							</Container>
						}
					/>
				</Sheet>
			</ListingContainer>
		);
	}

	return (
		<ListingContainer
			listingNavApi={listingNavApi}
			progress={false}
		>
			<Sheet tone={"primary"}>
				<Status
					icon={SendPackageIcon}
					textTitle={"Submit listing - status (title)"}
					tone={"primary"}
					action={
						<Button
							iconEnabled={CheckIcon}
							tone={"primary"}
							theme={"dark"}
							size={"xl"}
							label={"Submit listing (button)"}
							disabled={uploadContentMutation.isPending}
							onClick={() => {
								uploadContentMutation.mutate(files);
							}}
						/>
					}
					tweak={{
						slot: {
							body: {
								class: [
									"flex",
									"flex-col",
									"gap-2",
								],
							},
						},
					}}
				>
					{files.map((photo) => {
						const progress = photoProgress[photo.name] || 0;
						if (progress <= 0 || progress >= 100) {
							return null;
						}

						return (
							<Progress
								key={photo?.name}
								value={progress}
								size={"lg"}
								tweak={{
									variant: {
										tone: "primary",
										theme: "dark",
									},
								}}
							/>
						);
					})}
				</Status>
			</Sheet>
		</ListingContainer>
	);
});
