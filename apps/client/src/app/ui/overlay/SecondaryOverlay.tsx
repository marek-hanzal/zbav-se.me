import { Overlay } from "@use-pico/client";
import type { FC } from "react";

export namespace SecondaryOverlay {
	export interface Props extends Overlay.Props {}
}

export const SecondaryOverlay: FC<SecondaryOverlay.Props> = ({ ...props }) => {
	return (
		<Overlay
			type="bg-2"
			opacity={"high"}
			accentFrom="warning.dark"
			accentTo="secondary.dark"
			{...props}
		/>
	);
};
