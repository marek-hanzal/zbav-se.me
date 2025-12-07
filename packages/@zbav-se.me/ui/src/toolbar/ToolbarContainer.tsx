import { Container } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";

export namespace ToolbarContainer {
	export interface Props extends Container.Props {
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
			layout={"vertical-flex"}
			snapTo={"right-center"}
			square={"md"}
			gap={"lg"}
			height={"full"}
			width={"full"}
			//
			data-flip={flip}
			data-horizontal={horizontal}
			//
			className={tvc([
				"opacity-90",
				"z-100",
			])}
			{...props}
		/>
	);
};
