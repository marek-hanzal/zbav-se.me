import { Icon } from "@use-pico/client";
import { type Cls, useCls, withCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { TitleCls } from "~/app/ui/title/TitleCls";

export namespace Title {
	export interface Props extends TitleCls.Props<PropsWithChildren> {
		icon?: Icon.Type;
		iconProps?: Icon.Props;
		tone?: Cls.VariantOf<TitleCls, "tone">;
		theme?: Cls.VariantOf<TitleCls, "theme">;
		size?: Cls.VariantOf<TitleCls, "size">;
	}
}

export const BaseTitle: FC<Title.Props> = ({
	icon,
	iconProps,
	tone,
	theme,
	size,
	cls = TitleCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			tone,
			theme,
			size,
		}),
	}));

	return (
		<div
			data-ui="Title-root"
			className={slots.root()}
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
