import { Icon, Tx } from "@use-pico/client";
import { type Cls, useCls, withCls } from "@use-pico/cls";
import type { FC, HTMLAttributes, Ref } from "react";
import { TitleCls } from "~/app/ui/title/TitleCls";

export namespace Title {
	export interface Props
		extends TitleCls.Props<
			Omit<HTMLAttributes<HTMLDivElement>, "children">
		> {
		ref?: Ref<HTMLDivElement>;
		title: string;
		icon?: Icon.Type;
		iconProps?: Icon.Props;
		tone?: Cls.VariantOf<TitleCls, "tone">;
		theme?: Cls.VariantOf<TitleCls, "theme">;
		size?: Cls.VariantOf<TitleCls, "size">;
	}
}

export const BaseTitle: FC<Title.Props> = ({
	ref,
	title,
	icon,
	iconProps,
	tone,
	theme,
	size,
	cls = TitleCls,
	tweak,
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

			<div data-ui="Title-content">
				<Tx
					label={title}
					size={"lg"}
					font="bold"
				/>
			</div>
		</div>
	);
};

export const Title = withCls(BaseTitle, TitleCls);
