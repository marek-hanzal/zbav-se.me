import type { FC } from "react";
import { tvc } from "@/lib/client/cls";
import { Container } from "@/lib/client/container";
import { Icon } from "@/lib/client/icon";

export namespace TypoIcon {
	export interface Props extends Container.Props {
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
		flip?: boolean;
	}
}

export const TypoIcon: FC<TypoIcon.Props> = ({
	icon,
	iconProps,
	flip,
	children,
	className,
	...props
}) => {
	return (
		<Container
			data-ui-flow="horizontal"
			data-ui-items="center"
			data-ui-justify="space-between"
			data-ui-gap="sm"
			data-ui-width="full"
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
					"w-full",
					ui?.items === "start" && "items-start",
					ui?.items === "center" && "items-center",
				])}
			>
				{children}
			</div>
		</Container>
	);
};
