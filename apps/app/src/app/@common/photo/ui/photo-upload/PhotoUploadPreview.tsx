import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withUploadFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import type { PhotoUpload } from "~/app/@common/photo/ui/PhotoUpload";

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
		<withUploadFetchQuery.Suspense
			data={{
				where: {
					id: value,
				},
			}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				return (
					<HeroImage
						src={data.url}
						alt={data.id}
						visible
						ui={{
							round: "default",
						}}
					/>
				);
			}}
		</withUploadFetchQuery.Suspense>
	);
};
