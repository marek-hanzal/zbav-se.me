import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace ToolbarContainer {
	export interface Props extends Container.Props {}
}

export const ToolbarContainer: FC<ToolbarContainer.Props> = ({
	tweak,
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
			border={"default"}
			shadow={"default"}
			round={"full"}
			gap={"lg"}
			tone={"secondary"}
			theme={"light"}
			tweak={[
				tweak,
				{
					slot: {
						root: {
							class: [
								"opacity-80",
								"z-100",
							],
						},
					},
				},
			]}
			{...props}
		/>
	);
};
