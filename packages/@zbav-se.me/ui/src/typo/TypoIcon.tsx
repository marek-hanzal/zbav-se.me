import { Icon } from "@use-pico/client/icon";
import { tvc } from "@use-pico/cls";
import type { ComponentProps, FC, ReactNode } from "react";
import { uiTypoIcon } from "./uiTypoIcon";

export namespace TypoIcon {
	export interface Props extends uiTypoIcon.Component<ComponentProps<"div">> {
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
		justify?: uiTypoIcon.Justify;
		items?: uiTypoIcon.Items;
		children?: ReactNode;
	}
}

export const TypoIcon: FC<TypoIcon.Props> = ({
	icon,
	iconProps,
	justify,
	items,
	children,
	ui,
	className,
	...props
}) => {
	return (
		<div
			{...uiTypoIcon({
				ui: {
					...ui,
					justify,
					items,
				},
				className: tvc([
					"TypoIcon-root",
					"flex",
					"flex-row",
					"gap-2",
					className,
				]),
			})}
			{...props}
		>
			<Icon
				icon={icon}
				{...iconProps}
			/>

			<div
				className={tvc([
					"flex",
					"flex-col",
					"items-start",
					items === "start" && "items-start",
					items === "center" && "items-center",
				])}
			>
				{children}
			</div>
		</div>
	);
};
