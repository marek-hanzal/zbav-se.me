import { type FC, useState } from "react";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { withFeedGalleryCreateMutation } from "~/buyer-feed-gallery/mutation/withFeedGalleryCreateMutation";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { GalleryUpload } from "~/gallery/ui/GalleryUpload/index";
import { Container } from "~/ui/ui/Container";

export namespace GalleryPatch {
	export interface Props {
		feed: FeedSchema.Type;
		onSettledFn?(): void;
		onCancelFn(): void;
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({ feed, onSettledFn, onCancelFn }) => {
	const [uploadIds, setUploadIdsFn] = useState<string[]>(
		feed.uploadId
			? [
					feed.uploadId,
				]
			: [],
	);
	const mutation = withFeedGalleryCreateMutation.useMutation({
		onSettled: onSettledFn,
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
					setFn: setUploadIdsFn,
				}}
				limit={1}
			/>

			<SaveContainer
				onCancelFn={() => {
					setUploadIdsFn(
						feed.uploadId
							? [
									feed.uploadId,
								]
							: [],
					);
					onCancelFn();
				}}
				onSaveFn={() => {
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
