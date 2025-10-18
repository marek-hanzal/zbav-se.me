import { useMutation } from "@tanstack/react-query";
import { Button, Progress, Status, type useSnapperNav } from "@use-pico/client";
import { linkTo } from "@use-pico/common";
import { upload } from "@vercel/blob/client";
import PQueue from "p-queue";
import type { FC } from "react";
import { memo, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { LeftButton } from "~/app/listing/ui/CreateListing/LeftButton";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { Sheet } from "~/app/sheet/Sheet";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";
import { Title } from "~/app/ui/title/Title";

export const SubmitWrapper: FC<{
	listingNavApi: useSnapperNav.Api;
}> = memo(({ listingNavApi }) => {
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);
	const photos = useCreateListingStore((store) => store.photos);

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
			<FlowContainer>
				<ListingProgress />

				<Title
					tone={"secondary"}
					textTitle="Submit - one more thing (title)"
				/>

				<Sheet
					tone={"secondary"}
					theme={"light"}
				>
					<Status
						icon={SendPackageIcon}
						tone={"secondary"}
						theme={"light"}
						textTitle="Submit listing - status - cannot submit (title)"
						action={<LeftButton onClick={listingNavApi.prev} />}
					/>
				</Sheet>
			</FlowContainer>
		);
	}

	return (
		<FlowContainer>
			<ListingProgress />

			<Title
				textTitle={"Submit listing - status (title)"}
				left={<LeftButton onClick={listingNavApi.prev} />}
			/>

			<Sheet tone={"secondary"}>
				<Status
					icon={SendPackageIcon}
					textTitle={"Submit listing - status (title)"}
					tone={"secondary"}
					action={
						<Button
							iconEnabled={CheckIcon}
							tone={"secondary"}
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
		</FlowContainer>
	);
});
