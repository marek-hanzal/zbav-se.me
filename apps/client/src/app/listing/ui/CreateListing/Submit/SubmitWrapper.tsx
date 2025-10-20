import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
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
import { ListingGalleryPayload } from "@zbav-se.me/common";
import PQueue from "p-queue";
import type { FC } from "react";
import { memo, useId, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { withListingCreateMutation } from "~/app/listing/mutation/withListingCreateMutation";
import type { createListingStore } from "~/app/listing/store/createListingStore";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { ListingPageIndex } from "~/app/listing/ui/CreateListing/ListingPageIndex";
import { Sheet } from "~/app/sheet/Sheet";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

const IconMap = ListingPageIndex.Page;

export const SubmitWrapper: FC<{
	listingNavApi: useSnapperNav.Api;
}> = memo(({ listingNavApi }) => {
	const navigate = useNavigate();
	const { locale } = useParams({
		from: "/$locale",
	});
	const { user } = useLoaderData({
		from: "/$locale/app",
	});
	const useCreateListingStore = useCreateListingContext();
	const store = useCreateListingStore();
	const missingId = useId();
	const files = store.photos.filter((photo) => !!photo);

	// Track overall upload progress for all photos
	const [progress, setProgress] = useState(0);

	// Photo upload functionality with cumulative progress
	const uploadPhotos = async (
		photos: File[],
		listingId: string,
		token: string,
	) => {
		setProgress(0);

		const queue = new PQueue({
			concurrency: 3,
		});

		const totalUploads = photos.length;
		const photoProgresses = new Array(totalUploads).fill(0);

		const uploadPromises = photos.map(async (photo, index) => {
			return queue.add(() =>
				upload(`/${user.id}/${photo.name}`, photo, {
					access: "public",
					contentType: photo.type,
					handleUploadUrl: linkTo({
						base: import.meta.env.VITE_API,
						href: "/api/token/listing/gallery/upload",
					}),
					onUploadProgress({ percentage }) {
						// Update progress for this specific photo
						photoProgresses[index] = percentage;

						// Calculate cumulative progress
						const totalProgress = photoProgresses.reduce(
							(sum, progress) => sum + progress,
							0,
						);
						const averageProgress = totalProgress / totalUploads;
						setProgress(averageProgress);
					},
					multipart: false,
					clientPayload: JSON.stringify(
						ListingGalleryPayload.parse({
							listingId,
							sort: index,
						}),
					),
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			);
		});

		await Promise.all(uploadPromises);
	};

	const createListingMutation = withListingCreateMutation().useMutation({
		async onSuccess(data) {
			await uploadPhotos(files, data.id, data.upload);

			return navigate({
				to: "/$locale/app/listing/$id/view",
				params: {
					id: data.id,
					locale,
				},
			});
		},
	});

	if (store.missing.length > 0) {
		return (
			<ListingContainer listingNavApi={listingNavApi}>
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
											return store.missing.includes(
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
							label={
								progress > 0 && progress < 100
									? "Uploading photos..."
									: createListingMutation.isPending
										? "Creating listing..."
										: "Submit listing (button)"
							}
							disabled={
								createListingMutation.isPending ||
								(progress > 0 && progress < 100)
							}
							onClick={() => {
								try {
									createListingMutation.mutate(store.get());
								} catch (error) {
									console.error(error);
								}
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
					{progress > 0 && progress < 100 && (
						<Progress
							value={progress}
							size={"lg"}
							tweak={{
								variant: {
									tone: "primary",
									theme: "dark",
								},
							}}
						/>
					)}
				</Status>
			</Sheet>
		</ListingContainer>
	);
});
