import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace BottomContainer {
	export interface Props extends Container.Props {}
}

export const BottomContainer: FC<BottomContainer.Props> = (props) => {
	return (
		<Container
			data-ui={"BottomContainer"}
			{...props}
		/>
	);
};
