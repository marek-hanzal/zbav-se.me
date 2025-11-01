import { Icon } from "@use-pico/client/icon";
import { type Cls, useCls } from "@use-pico/cls";
import type { FC, HTMLAttributes } from "react";
import { TypoIconCls } from "./TypoIconCls";

export namespace TypoIcon {
	export interface Props
		extends TypoIconCls.Props<HTMLAttributes<HTMLDivElement>> {
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
		justify?: Cls.VariantOf<TypoIconCls, "justify">;
		items?: Cls.VariantOf<TypoIconCls, "items">;
	}
}

export const TypoIcon: FC<TypoIcon.Props> = ({
	icon,
	iconProps,
	justify,
	items,
	children,
	cls = TypoIconCls,
	tweak,
	...props
}) => {
	const { slots } = useCls(cls, tweak, {
		variant: {
			justify,
			items,
		},
	});

	return (
		<div
			className={slots.root()}
			{...props}
		>
			<Icon
				icon={icon}
				size={"sm"}
				{...iconProps}
			/>

			<div className={slots.content()}>{children}</div>
		</div>
	);
};
