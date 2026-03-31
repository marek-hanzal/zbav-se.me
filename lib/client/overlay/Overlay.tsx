import type { ComponentProps, FC } from "react";
import { uiOverlay } from "./uiOverlay";

export namespace Overlay {
	export interface Props extends uiOverlay.Component<ComponentProps<"div">> {
		//
	}
}

export const Overlay: FC<Overlay.Props> = ({ ui, className, ...props }) => {
	return (
		<div
			{...uiOverlay({
				ui,
				className,
			})}
			{...props}
		>
			<div className="Overlay-top" />
			<div className="Overlay-bottom" />
		</div>
	);
};
