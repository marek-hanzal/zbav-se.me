import type { FC } from "react";
import type { PhotoUpload } from "~/app/@common/photo/ui/PhotoUpload";
import { PhotoUploadPreviewImageSuspense } from "~/app/@common/photo/ui/PhotoUpload/PhotoUploadPreviewImageSuspense";

export namespace PhotoUploadPreview {
	export interface Props {
		value: PhotoUpload.Value;
	}
}

export const PhotoUploadPreview: FC<PhotoUploadPreview.Props> = ({ value }) => {
	if (!value) {
		return null;
	}

	return <PhotoUploadPreviewImageSuspense uploadId={value} />;
};
