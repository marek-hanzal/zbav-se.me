import type { FC } from "react";
import { Container } from "~/ui/ui/Container";

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
