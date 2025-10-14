import { Overlay } from "@use-pico/client";
import type { FC } from "react";

export namespace PrimaryOverlay {
	export interface Props extends Overlay.Props {}
}

export const PrimaryOverlay: FC<PrimaryOverlay.Props> = ({ ...props }) => {
	return (
		<Overlay
			type="bg-2"
			opacity={"high"}
			accentFrom="primary.dark"
			accentTo="secondary.dark"
			{...props}
		/>
	);
};
