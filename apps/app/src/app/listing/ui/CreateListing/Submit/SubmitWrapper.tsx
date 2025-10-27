import { useNavigate, useParams } from "@tanstack/react-router";
import {
	Button,
	CheckIcon,
	Container,
	Progress,
	Status,
} from "@use-pico/client";
import { SendPackageIcon } from "@zbav-se.me/ui";
import type { FC } from "react";
import { memo, useState } from "react";
import { withListingGalleryCreateMutation } from "~/app/listing/mutation/withListingGalleryCreateMutation";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { withS3PreSignMutation } from "~/app/s3/mutation/withS3PreSignMutation";

export const SubmitWrapper: FC = memo(() => {
	const navigate = useNavigate();
	const { locale } = useParams({
		from: "/$locale",
	});

	const preSignMutation = withS3PreSignMutation.useMutation();
	const createListingGalleryMutation =
		withListingGalleryCreateMutation.useMutation();

	const [progress, setProgress] = useState(0);

	// const createListingMutation = withListingCreateMutation().useMutation({
	// 	async onPostMutation({ result }) {
	// 		setProgress(0);

	// 		const queue = new PQueue({
	// 			concurrency: 3,
	// 		});
	// 		const total = files.length;
	// 		const perFile = new Array(total).fill(0);

	// 		const upload = async (photo: File, index: number) => {
	// 			const path = `listing/${result.id}`;
	// 			const contentType = photo.type as AllowedContentTypes;
	// 			const dot = photo.name.lastIndexOf(".");
	// 			const extension =
	// 				dot !== -1 && dot < photo.name.length - 1
	// 					? photo.name.slice(dot + 1).toLowerCase()
	// 					: "unknown";

	// 			const presign = await preSignMutation.mutateAsync({
	// 				path,
	// 				extension: extension as AllowedExtensions,
	// 				contentType,
	// 			});

	// 			await axios.put(presign.url, photo, {
	// 				headers: {
	// 					"Content-Type": contentType,
	// 				},
	// 				onUploadProgress: (e) => {
	// 					const totalSize = e.total ?? photo.size;
	// 					if (!totalSize || totalSize <= 0) {
	// 						return;
	// 					}
	// 					perFile[index] = Math.max(
	// 						0,
	// 						Math.min(100, (e.loaded / totalSize) * 100),
	// 					);
	// 					setProgress(perFile.reduce((s, v) => s + v, 0) / total);
	// 				},
	// 			});

	// 			await createListingGalleryMutation.mutateAsync({
	// 				listingId: result.id,
	// 				sort: index,
	// 				url: presign.cdn,
	// 			});

	// 			perFile[index] = 100;
	// 			setProgress(perFile.reduce((s, v) => s + v, 0) / total);
	// 		};

	// 		await queue.onIdle();

	// 		return navigate({
	// 			to: "/$locale/listing/$id/view",
	// 			params: {
	// 				id: result.id,
	// 				locale,
	// 			},
	// 		});
	// 	},
	// });

	// if (store.missing.length > 0) {
	// 	return <InvalidSubmit />;
	// }

	return (
		<ListingContainer>
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
								theme={"dark"}
							/>
						) : (
							<Button
								iconEnabled={CheckIcon}
								tone={"primary"}
								theme={"dark"}
								size={"xl"}
								label={"Submit listing (button)"}
								// disabled={createListingMutation.isPending}
								onClick={() => {
									// try {
									// createListingMutation.mutate(
									// 	store.get(),
									// );
									// } catch (error) {
									// 	console.error(error);
									// }
								}}
							/>
						)
					}
				/>
			</Container>
		</ListingContainer>
	);
});
