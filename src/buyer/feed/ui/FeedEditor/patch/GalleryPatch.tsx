import { useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
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
	const queryClient = useQueryClient();
	const [uploadIds, setUploadIds] = useState<string[]>(
		feed.uploadId
			? [
					feed.uploadId,
				]
			: [],
	);
	const mutation = withFeedGalleryCreateMutation.useMutation({
		async onSuccess() {
			await withFeedQuery.invalidator(
				queryClient,
				[
					"fetch",
				],
				{
					fetch: {
						where: {
							id: feed.id,
						},
					},
				},
			);
		},
		onSettled,
	});

	return (
		<Container
			data-ui={"FeedDetailContainer-[GalleryUploadSheet]"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-gap="default"
			data-ui-inner="default"
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
