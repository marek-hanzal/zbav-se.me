import type { ComponentProps, FC } from "react";
import { uiOverlay } from "~/ui/fn/uiOverlay";

export namespace Overlay {
	export interface Props extends uiOverlay.Component<ComponentProps<"div">> {
		//
	}
}

export const Overlay: FC<Overlay.Props> = ({ className, ...props }) => {
	return (
		<div
			{...uiOverlay({
				className,
			})}
			{...props}
		>
			<div className="Overlay-top" />
			<div className="Overlay-bottom" />
		</div>
	);
};
