import { Container } from "@use-pico/client";
import type { FC } from "react";

export namespace FlowContainer {
	export interface Props extends Container.Props {}
}

export const FlowContainer: FC<FlowContainer.Props> = (props) => {
	return (
		<Container
			layout={"vertical-header-content-footer"}
			tone={"secondary"}
			theme={"light"}
			square={"md"}
			gap={"xs"}
			position={"relative"}
			{...props}
		/>
	);
};
