import { Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import type { FC, ReactNode } from "react";

export namespace TypoIcon {
	export interface Props extends Container.Props {
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
		flip?: boolean;
		children?: ReactNode;
	}
}

export const TypoIcon: FC<TypoIcon.Props> = ({
	icon,
	iconProps,
	flip,
	children,
	ui,
	className,
	...props
}) => {
	return (
		<Container
			ui={{
				flow: "horizontal",
				items: "center",
				justify: "space-between",
				gap: "sm",
				width: "full",
				...ui,
			}}
			className={tvc([
				flip && "flex-row-reverse",
				className,
			])}
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
					ui?.items === "start" && "items-start",
					ui?.items === "center" && "items-center",
				])}
			>
				{children}
			</div>
		</Container>
	);
};
