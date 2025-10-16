import { useMutation } from "@tanstack/react-query";
import { Button, Progress, Status } from "@use-pico/client";
import { linkTo } from "@use-pico/common";
import { upload } from "@vercel/blob/client";
import PQueue from "p-queue";
import type { FC } from "react";
import { useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Sheet } from "~/app/sheet/Sheet";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export const SubmitWrapper: FC = () => {
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
			<Sheet
				tone={"secondary"}
				theme={"light"}
			>
				<Status
					icon={SendPackageIcon}
					tone={"secondary"}
					theme={"light"}
					textTitle="Submit listing - status - cannot submit (title)"
				/>
			</Sheet>
		);
	}

	return (
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
	);
};
