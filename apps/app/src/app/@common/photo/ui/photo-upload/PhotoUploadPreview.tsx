import { type FC, Suspense } from "react";
import type { PhotoUpload } from "~/app/@common/photo/ui/PhotoUpload";
import { PhotoUploadPreviewImage } from "~/app/@common/photo/ui/photo-upload/PhotoUploadPreviewImage";
import { PhotoUploadPreviewImagePending } from "~/app/@common/photo/ui/photo-upload/PhotoUploadPreviewImagePending";

export namespace PhotoUploadPreview {
	export interface Props {
		value: PhotoUpload.Value;
	}
}

export const PhotoUploadPreview: FC<PhotoUploadPreview.Props> = ({ value }) => {
	if (!value) {
		return null;
	}

	return (
		<Suspense fallback={<PhotoUploadPreviewImagePending />}>
			<PhotoUploadPreviewImage
				_suspense={"I know"}
				uploadId={value}
			/>
		</Suspense>
	);
};
