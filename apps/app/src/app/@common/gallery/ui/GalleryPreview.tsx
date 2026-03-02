import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useRef } from "react";

export namespace GalleryPreview {
	export interface Props extends Container.Props {
		uploads: tUpload[];
	}
}

/**
 * Shows a visual preview of gallery content, including loading-aware rendering.
 * Use it to confirm selected media before the final submit action.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const GalleryPreview: FC<GalleryPreview.Props> = ({ uploads, ui, ...props }) => {
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
