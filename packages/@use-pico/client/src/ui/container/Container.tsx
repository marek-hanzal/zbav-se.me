import { asContainer } from "@use-pico/theme/container";
import type { ComponentProps, FC } from "react";

export namespace Container {
	export interface Props extends asContainer.Props<Omit<ComponentProps<"div">, "onChange">> {
		//
	}
}

export const Container: FC<Container.Props> = ({
	tone,
	theme,
	//
	height,
	width,
	layout,
	scroll,
	snap,
	snapAlign,
	inner,
	gap,
	position,
	disabled,
	//
	className,
	//
	...props
}) => {
	return (
		<div
			{...asContainer({
				tone,
				theme,
				//
				height,
				width,
				layout,
				scroll,
				snap,
				snapAlign,
				inner,
				gap,
				position,
				disabled,
				//
				className,
			})}
			//
			{...props}
		/>
	);
};
