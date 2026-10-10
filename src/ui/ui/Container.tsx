import type { ComponentProps, FC } from "react";
import { uiContainerFn } from "~/ui/fn/uiContainerFn";

export namespace Container {
	export interface Props extends uiContainerFn.Component<ComponentProps<"div">> {
		//
	}
}

export const Container: FC<Container.Props> = ({ className, ...props }) => {
	return (
		<div
			{...uiContainerFn({
				className,
			})}
			{...props}
		/>
	);
};

export type Container = typeof Container;
