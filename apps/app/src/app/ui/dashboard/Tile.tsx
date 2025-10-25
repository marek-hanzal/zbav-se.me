import { Container, type Icon, Status } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import type { FC } from "react";
import { ThemeCls } from "~/app/ui/ThemeCls";

export namespace Tile {
	export interface Props extends Container.Props {
		icon: Icon.Type;
		textTitle?: string;
		textMessage?: string;
	}
}

export const Tile: FC<Tile.Props> = ({
	icon,
	textTitle,
	textMessage,
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
			layout={"vertical-content-footer"}
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
					textTitle={textTitle}
					textMessage={textMessage}
					titleProps={{
						size: "xl",
					}}
					messageProps={{
						size: "sm",
					}}
				/>
			</VariantProvider>
		</Container>
	);
};
