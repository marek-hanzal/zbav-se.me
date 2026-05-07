import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { withFeedGalleryCreateMutation } from "~/buyer/feed-gallery/mutation/withFeedGalleryCreateMutation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { GalleryUpload } from "~/common/gallery/ui/GalleryUpload";

export namespace GalleryPatch {
	export interface Props {
		feed: FeedSchema.Type;
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
			data-ui={"GalleryPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-gap="default"
			data-ui-inner="default"
		>
			<GalleryUpload
				access="private"
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
				disabled={uploadIds.length === 0 || mutation.isPending}
			/>
		</Container>
	);
};
