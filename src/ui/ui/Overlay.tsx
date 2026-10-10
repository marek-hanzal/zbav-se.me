import type { ComponentProps, FC } from "react";
import { uiOverlayFn } from "~/ui/fn/uiOverlayFn";

export namespace Overlay {
	export interface Props extends uiOverlayFn.Component<ComponentProps<"div">> {
		//
	}
}

export const Overlay: FC<Overlay.Props> = ({ className, ...props }) => {
	return (
		<div
			{...uiOverlayFn({
				className,
			})}
			{...props}
		>
			<div className="Overlay-top" />
			<div className="Overlay-bottom" />
		</div>
	);
};
