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
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const GalleryPreview: FC<GalleryPreview.Props> = ({ uploads, ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"GalleryButton-[Container.wrapper]"}
			ui={{
				position: "relative",
				height: "full",
				inner: "default",
				round: "default",
				...ui,
			}}
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				data-ui={"GalleryButton-[Container.content]"}
				ui={{
					layout: "vertical-full",
					height: "full",
					snap: "vertical",
					snapAlign: "center",
					gap: "default",
				}}
			>
				{uploads.map((upload) => {
					return (
						<HeroImage
							key={upload.id}
							src={upload.url}
							alt={"Gallery image"}
							ui={{
								height: "full",
								round: "default",
							}}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
