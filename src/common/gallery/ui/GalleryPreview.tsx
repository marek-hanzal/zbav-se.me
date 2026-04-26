import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import { Fade } from "@/lib/client/fade";
import { HeroImage } from "~/common/ui/img";

export namespace GalleryPreview {
	export interface Props extends Container.Props {
		urls: string[];
	}
}

/**
 * Shows a visual preview of gallery content, including loading-aware rendering.
 * Use it to confirm selected media before the final submit action.
 */
export const GalleryPreview: FC<GalleryPreview.Props> = ({ urls, ...props }) => {
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
				{urls.map((imageUrl, index) => {
					return (
						<HeroImage
							// biome-ignore lint/suspicious/noArrayIndexKey: Sssst
							key={index}
							src={imageUrl}
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
