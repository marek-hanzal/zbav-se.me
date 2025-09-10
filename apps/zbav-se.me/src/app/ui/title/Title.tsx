import { Icon } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { TitleCls } from "~/app/ui/title/TitleCls";

export namespace Title {
	export interface Props extends TitleCls.Props<PropsWithChildren> {
		icon?: Icon.Type;
		iconProps?: Icon.Props;
	}
}

export const Title: FC<Title.Props> = ({
	icon,
	iconProps,
	cls = TitleCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			<Icon
				icon={icon}
				{...iconProps}
			/>
			{children}
		</div>
	);
};
