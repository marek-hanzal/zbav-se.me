import type { ComponentProps, FC } from "react";
import { uiContainer } from "./uiContainer";

export namespace Container {
	export interface Props extends uiContainer.Component<ComponentProps<"div">> {
		//
	}
}

export const Container: FC<Container.Props> = ({ className, ...props }) => {
	return (
		<div
			{...uiContainer({
				className,
			})}
			{...props}
		/>
	);
};

export type Container = typeof Container;
