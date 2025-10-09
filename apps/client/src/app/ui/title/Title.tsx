import { Icon } from "@use-pico/client";
import { type Cls, useCls, withCls } from "@use-pico/cls";
import type { FC, HTMLAttributes, Ref } from "react";
import { TitleCls } from "~/app/ui/title/TitleCls";

export namespace Title {
	export interface Props
		extends TitleCls.Props<HTMLAttributes<HTMLDivElement>> {
		ref?: Ref<HTMLDivElement>;
		icon?: Icon.Type;
		iconProps?: Icon.Props;
		tone?: Cls.VariantOf<TitleCls, "tone">;
		theme?: Cls.VariantOf<TitleCls, "theme">;
		size?: Cls.VariantOf<TitleCls, "size">;
	}
}

export const BaseTitle: FC<Title.Props> = ({
	ref,
	icon,
	iconProps,
	tone,
	theme,
	size,
	cls = TitleCls,
	tweak,
	children,
	...props
}) => {
	const { slots } = useCls(
		cls,
		{
			variant: {
				tone,
				theme,
				size,
			},
		},
		tweak,
	);

	return (
		<div
			data-ui="Title-root"
			ref={ref}
			className={slots.root()}
			{...props}
		>
			<Icon
				icon={icon}
				{...iconProps}
			/>
			<div data-ui="Title-content">{children}</div>
		</div>
	);
};

export const Title = withCls(BaseTitle, TitleCls);
