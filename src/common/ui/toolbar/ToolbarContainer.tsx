import type { FC } from "react";
import { Container } from "@/lib/client/container";
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
