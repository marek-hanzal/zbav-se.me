import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace PhotoUploadPreviewImagePending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const PhotoUploadPreviewImagePending: FC<PhotoUploadPreviewImagePending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
