import { useMutation } from "@tanstack/react-query";
import { Button, Status } from "@use-pico/client";
import { linkTo } from "@use-pico/common";
import { upload } from "@vercel/blob/client";
import PQueue from "p-queue";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Sheet } from "~/app/sheet/Sheet";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export const SubmitWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);
	const photos = useCreateListingStore((store) => store.photos);

	const uploadContentMutation = useMutation<any, Error, (File | undefined)[]>(
		{
			mutationKey: [
				"content",
				"upload",
			],
			async mutationFn(photos) {
				const queue = new PQueue({
					concurrency: 3,
				});

				photos
					.filter((photo) => !!photo)
					.map(async (photo) => {
						queue.add(() =>
							upload(photo.name, photo, {
								access: "public",
								contentType: photo.type,
								handleUploadUrl: linkTo({
									base: import.meta.env.VITE_API,
									href: "/api/content/upload",
								}),
								// clientPayload: null,
								onUploadProgress({ percentage }) {
									console.log(percentage);
								},
								multipart: true,
								// onProgress?.(
								// 	total
								// 		? Math.round((sent / total) * 100)
								// 		: 0,
								// ),
							}),
						);
					});
			},
		},
	);

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
							uploadContentMutation.mutate(photos);
						}}
					/>
				}
			/>
		</Sheet>
	);
};
