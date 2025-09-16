import { type Cls, useCls } from "@use-pico/cls";
import type { FC, HTMLAttributes, Ref } from "react";
import { ContainerCls } from "~/app/ui/container/ContainerCls";

export namespace Container {
	export interface Props
		extends ContainerCls.Props<HTMLAttributes<HTMLDivElement>> {
		ref?: Ref<HTMLDivElement>;
		height?: Cls.VariantOf<ContainerCls, "height">;
		width?: Cls.VariantOf<ContainerCls, "width">;
		orientation?: Cls.VariantOf<ContainerCls, "orientation">;
		overflow?: Cls.VariantOf<ContainerCls, "overflow">;
		snap?: Cls.VariantOf<ContainerCls, "snap">;
		item?: Cls.VariantOf<ContainerCls, "item">;
	}
}

export const Container: FC<Container.Props> = ({
	ref,
	//
	height,
	width,
	orientation,
	overflow,
	snap,
	item,
	//
	cls = ContainerCls,
	tweak,
	children,
	...props
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			height,
			width,
			orientation,
			overflow,
			snap,
			item,
		}),
	}));

	return (
		<div
			ref={ref}
			data-ui="Container-root"
			className={slots.root()}
			{...props}
		>
			{children}
		</div>
	);
};
