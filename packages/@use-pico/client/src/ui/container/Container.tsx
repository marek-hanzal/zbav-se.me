import type { ComponentProps, FC } from "react";
import { asContainer } from "./asContainer";

export namespace Container {
	export interface Props extends asContainer.PropsEx<Omit<ComponentProps<"div">, "onChange">> {
		//
	}
}

export const Container: FC<Container.Props> = ({
	tone,
	theme,
	height,
	width,
	layout,
	scroll,
	snap,
	snapAlign,
	square,
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
				height,
				width,
				layout,
				scroll,
				snap,
				snapAlign,
				square,
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
