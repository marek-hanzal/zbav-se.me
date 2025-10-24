import { useNavigate, useParams } from "@tanstack/react-router";
import {
	Button,
	Container,
	Progress,
	Status,
	type useSnapperNav,
} from "@use-pico/client";
import { linkTo } from "@use-pico/common";
import type { AllowedContentTypes, AllowedExtensions } from "@zbav-se.me/sdk";
import axios from "axios";
import PQueue from "p-queue";
import type { FC } from "react";
import { memo, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { withListingCreateMutation } from "~/app/listing/mutation/withListingCreateMutation";
import { withListingGalleryCreateMutation } from "~/app/listing/mutation/withListingGalleryCreateMutation";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { InvalidSubmit } from "~/app/listing/ui/CreateListing/Submit/InvalidSubmit";
import { withS3PreSignMutation } from "~/app/s3/mutation/withS3PreSignMutation";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export const SubmitWrapper: FC<{
	listingNavApi: useSnapperNav.Api;
}> = memo(({ listingNavApi }) => {
	const navigate = useNavigate();
	const { locale } = useParams({
		from: "/$locale",
	});
	const useCreateListingStore = useCreateListingContext();
	const store = useCreateListingStore();
	const files = store.photos.filter(Boolean) as File[];

	const preSignMutation = withS3PreSignMutation.useMutation();
	const createListingGalleryMutation =
		withListingGalleryCreateMutation.useMutation();

	const [progress, setProgress] = useState(0);

	const upload = async (photos: File[], listingId: string) => {
		setProgress(0);

		const queue = new PQueue({
			concurrency: 3,
		});
		const total = photos.length;
		const perFile = new Array(total).fill(0);

		const upload = async (photo: File, index: number) => {
			const path = `listing/${listingId}`;
			const contentType = photo.type as AllowedContentTypes;
			const dot = photo.name.lastIndexOf(".");
			const extension =
				dot !== -1 && dot < photo.name.length - 1
					? photo.name.slice(dot + 1).toLowerCase()
					: "unknown";

			const presign = await preSignMutation.mutateAsync({
				path,
				extension: extension as AllowedExtensions,
				contentType,
			});

			await axios.put(presign.url, photo, {
				headers: {
					"Content-Type": contentType,
				},
				onUploadProgress: (e) => {
					const totalSize = e.total ?? photo.size;
					if (!totalSize || totalSize <= 0) {
						return;
					}
					perFile[index] = Math.max(
						0,
						Math.min(100, (e.loaded / totalSize) * 100),
					);
					setProgress(perFile.reduce((s, v) => s + v, 0) / total);
				},
			});

			await createListingGalleryMutation.mutateAsync({
				listingId,
				sort: index,
				url: linkTo({
					base: "https://content.zbav-se.me",
					href: presign.path,
				}),
			});

			perFile[index] = 100;
			setProgress(perFile.reduce((s, v) => s + v, 0) / total);
		};

		photos.forEach((photo, index) => {
			queue.add(async () => {
				try {
					await upload(photo, index);
				} catch (err) {
					console.error("[upload photo] failed", err);
					perFile[index] = 100;
					setProgress(perFile.reduce((s, v) => s + v, 0) / total);
				}
			});
		});

		await queue.onIdle();
	};

	const createListingMutation = withListingCreateMutation().useMutation({
		async onSuccess(data) {
			await upload(files, data.id);
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
		return <InvalidSubmit listingNavApi={listingNavApi} />;
	}

	return (
		<ListingContainer
			listingNavApi={listingNavApi}
			progress={false}
		>
			<Container layout={"vertical-content-footer"}>
				<Status
					icon={SendPackageIcon}
					textTitle={"Submit listing - status (title)"}
					tone={"primary"}
					action={
						progress > 0 ? (
							<Progress
								value={progress}
								size={"lg"}
								tone={"secondary"}
							/>
						) : (
							<Button
								iconEnabled={CheckIcon}
								tone={"primary"}
								theme={"dark"}
								size={"xl"}
								label={"Submit listing (button)"}
								disabled={createListingMutation.isPending}
								onClick={() => {
									try {
										createListingMutation.mutate(
											store.get(),
										);
									} catch (error) {
										console.error(error);
									}
								}}
							/>
						)
					}
				/>
			</Container>
		</ListingContainer>
	);
});
