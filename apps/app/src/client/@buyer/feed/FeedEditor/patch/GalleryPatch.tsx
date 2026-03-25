import { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer";
import { withFeedGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/buyer/feed";
import { type FC, useState } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { GalleryUpload } from "~/client/@common/gallery/ui/GalleryUpload";

export namespace GalleryPatch {
	export interface Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({ feed, onSettled, onCancel }) => {
	const [uploadIds, setUploadIds] = useState<string[]>(
		feed.uploadId
			? [
					feed.uploadId,
				]
			: [],
	);
	const mutation = withFeedGalleryCreateMutation.useMutation({
		onSettled,
	});

	return (
		<Container
			data-ui={"FeedDetailContainer-[GalleryUploadSheet]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
				inner: "default",
			}}
		>
			<GalleryUpload
				state={{
					value: uploadIds,
					set: setUploadIds,
				}}
				limit={1}
			/>

			<SaveContainer
				onCancel={() => {
					setUploadIds(
						feed.uploadId
							? [
									feed.uploadId,
								]
							: [],
					);
					onCancel();
				}}
				onSave={() => {
					mutation.mutate({
						feedId: feed.id,
						uploadIds,
					});
				}}
				loading={mutation.isPending}
				disabled={uploadIds.length === 0}
			/>
		</Container>
	);
};
