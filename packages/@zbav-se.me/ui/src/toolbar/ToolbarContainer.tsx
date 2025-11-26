import { Container, ContainerCls } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { ToolbarContainerCls } from "./ToolbarContainerCls";

export namespace ToolbarContainer {
	export interface Props extends ToolbarContainerCls.Props<Container.Props> {
		horizontal?: boolean;
		flip?: boolean;
	}
}

export const ToolbarContainer: FC<ToolbarContainer.Props> = ({
	horizontal = false,
	flip = false,
	tweak,
	cls = ToolbarContainerCls,
	...props
}) => {
	return (
		<Container
			layout={"vertical-flex"}
			items={"center"}
			height={"unset"}
			width={"unset"}
			snapTo={"right-center"}
			square={"md"}
			round={"full"}
			gap={"lg"}
			tweak={ContainerCls.tweak([
				tweak,
				{
					variant: {
						horizontal,
						flip,
					},
				},
				{
					slot: {
						root: {
							class: [
								"opacity-90",
								"z-100",
							],
						},
					},
				},
			])}
			cls={ContainerCls.use(cls)}
			{...props}
		/>
	);
};
