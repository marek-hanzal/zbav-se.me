import type { FC } from "react";
import type { uiToolbarContainerFn } from "~/application-ui/fn/uiToolbarContainerFn";
import { Container } from "~/ui/ui/Container";

export namespace ToolbarContainer {
	export interface Props extends uiToolbarContainerFn.Component<Container.Props> {
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
			data-ui-layout="vertical-flex"
			data-ui-snap-to="right-center"
			data-ui-inner="default"
			data-ui-gap="lg"
			data-ui-height="full"
			data-ui-width="full"
			{...props}
		/>
	);
};
