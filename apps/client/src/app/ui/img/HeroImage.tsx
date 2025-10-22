import type { FC, ImgHTMLAttributes } from "react";

export namespace HeroImage {
	export interface Props extends ImgHTMLAttributes<HTMLImageElement> {}
}

export const HeroImage: FC<HeroImage.Props> = (props) => {
	return (
		// biome-ignore lint/a11y/useAltText: Should go from props
		<img
			loading={"eager"}
			fetchPriority={"high"}
			decoding={"async"}
			{...props}
		/>
	);
};
