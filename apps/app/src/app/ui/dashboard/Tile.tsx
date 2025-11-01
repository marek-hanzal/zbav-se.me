import { type Icon, Status } from "@use-pico/client";
import { Container } from "@use-pico/client/ui/container";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui";
import type { FC } from "react";

export namespace Tile {
	export interface Props extends Container.Props {
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
		textTitle?: string;
		textMessage?: string;
		statusProps?: Omit<Status.Props, "textTitle" | "textMessage">;
	}
}

export const Tile: FC<Tile.Props> = ({
	icon,
	iconProps,
	textTitle,
	textMessage,
	statusProps,
	tone = "primary",
	theme = "light",
	...props
}) => {
	return (
		<Container
			tone={tone}
			theme={theme}
			border={"default"}
			shadow={"default"}
			round={"lg"}
			height={"auto"}
			// layout={"vertical-content-footer"}
			{...props}
		>
			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone,
					theme,
				}}
			>
				<Status
					icon={icon}
					iconProps={iconProps}
					textTitle={textTitle}
					textMessage={textMessage}
					titleProps={{
						size: "xl",
					}}
					messageProps={{
						size: "sm",
					}}
					{...statusProps}
				/>
			</VariantProvider>
		</Container>
	);
};
