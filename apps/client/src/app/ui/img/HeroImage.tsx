import type { FC, ImgHTMLAttributes } from "react";

export namespace HeroImage {
	export interface Props extends ImgHTMLAttributes<HTMLImageElement> {}
}

export const HeroImage: FC<HeroImage.Props> = (props) => {
	// biome-ignore lint/a11y/useAltText: Should go from props
	return <img {...props} />;
};
