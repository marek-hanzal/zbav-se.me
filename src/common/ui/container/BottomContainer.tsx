import type { FC } from "react";
import { Container } from "@/lib/client/container";

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
