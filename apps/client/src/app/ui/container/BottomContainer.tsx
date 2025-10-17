import { Container } from "@use-pico/client";
import type { FC } from "react";

export namespace BottomContainer {
	export interface Props extends Container.Props {}
}

export const BottomContainer: FC<BottomContainer.Props> = (props) => {
	return (
		<Container
			tone={"primary"}
			theme={"light"}
			round={"lg"}
			square={"md"}
			border={"default"}
			{...props}
		/>
	);
};
