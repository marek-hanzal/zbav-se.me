import { Container } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";

export namespace BottomContainer {
	export interface Props extends Container.Props {}
}

export const BottomContainer: FC<BottomContainer.Props> = (props) => {
	return (
		<Container
			ui="BottomContainer-root"
			className={tvc([
				"flex",
				"flex-row",
				"justify-between",
				"items-center",
			])}
			{...props}
		/>
	);
};
