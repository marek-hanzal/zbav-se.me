import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import type { uiToolbarContainer } from "./uiToolbarContainer";

export namespace ToolbarContainer {
	export interface Props extends uiToolbarContainer.Component<Container.Props> {
		horizontal?: boolean;
		flip?: boolean;
	}
}

export const ToolbarContainer: FC<ToolbarContainer.Props> = ({
	horizontal = false,
	flip = false,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui="ToolbarContainer"
			//
			data-ui-flip={flip}
			data-ui-horizontal={horizontal}
			//
			className={[
				"ToolbarContainer",
			]}
			ui={{
				layout: "vertical-flex",
				snapTo: "right-center",
				inner: "default",
				gap: "lg",
				height: "full",
				width: "full",
			}}
			{...props}
		/>
	);
};
