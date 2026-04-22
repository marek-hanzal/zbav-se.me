import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import { Fade } from "@/lib/client/fade";
import { HeroImage } from "~/common/ui/img";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export namespace GalleryPreview {
	export interface Props extends Container.Props {
		uploads: UploadSchema.Type[];
	}
}

/**
 * Shows a visual preview of gallery content, including loading-aware rendering.
 * Use it to confirm selected media before the final submit action.
 */
export const GalleryPreview: FC<GalleryPreview.Props> = ({ uploads, ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"GalleryPreview"}
			data-ui-position="relative"
			data-ui-height="full"
			data-ui-inner="default"
			data-ui-round="default"
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				data-ui-layout="vertical-full"
				data-ui-height="full"
				data-ui-snap="vertical"
				data-ui-snap-align="center"
				data-ui-gap="default"
			>
				{uploads.map((upload) => {
					return (
						<HeroImage
							key={upload.id}
							src={upload.url}
							alt={"Gallery image"}
							data-ui-height="full"
							data-ui-round="default"
						/>
					);
				})}
			</Container>
		</Container>
	);
};
