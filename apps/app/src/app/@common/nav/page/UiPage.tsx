import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { Nav } from "~/app/@common/nav/ui/Nav";

export namespace UiPage {
	export interface Props extends Container.Props {}
}

export const UiPage: FC<UiPage.Props> = ({ children, ui, ...props }) => {
	return (
		<Container
			data-ui="Ui[Container]"
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					tone: "neutral",
					theme: "light",
					shadow: true,
					height: "full",
					width: "full",
				}}
			>
				{children}
			</Container>

			<Nav />
		</Container>
	);
};
