import { Icon } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC, HTMLAttributes } from "react";
import { TypoIconCls } from "~/app/ui/text/TypoIconCls";

export namespace TypoIcon {
	export interface Props
		extends TypoIconCls.Props<HTMLAttributes<HTMLDivElement>> {
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
	}
}

export const TypoIcon: FC<TypoIcon.Props> = ({
	icon,
	iconProps,
	children,
	cls = TypoIconCls,
	tweak,
	...props
}) => {
	const { slots } = useCls(cls, tweak);

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
