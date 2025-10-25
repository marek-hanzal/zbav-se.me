import { Overlay } from "@use-pico/client";
import type { FC } from "react";

export namespace PrimaryOverlay {
	export interface Props extends Overlay.Props {}
}

export const PrimaryOverlay: FC<PrimaryOverlay.Props> = ({ ...props }) => {
	return (
		<Overlay
			type="bg-1"
			opacity={"25"}
			accentFrom="secondary.dark"
			accentTo="primary.light"
			{...props}
		/>
	);
};
