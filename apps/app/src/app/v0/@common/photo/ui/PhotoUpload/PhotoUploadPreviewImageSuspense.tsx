import { type FC, Suspense } from "react";
import { Data } from "./PhotoUploadPreviewImageSuspense/Data";
import { Pending } from "./PhotoUploadPreviewImageSuspense/Pending";

export namespace PhotoUploadPreviewImageSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const PhotoUploadPreviewImageSuspense: FC<PhotoUploadPreviewImageSuspense.Props> = (
	props,
) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
