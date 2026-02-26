import { MenuIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";
import { useState } from "react";
import { HomeMenuSheet } from "./HomeMenuSheet";

export namespace HomeMenuButton {
	export interface Props extends Button.Props {
		//
	}
}

export const HomeMenuButton: FC<HomeMenuButton.Props> = ({ ui, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				data-ui={"HomeMenuButton[Button]"}
				iconEnabled={MenuIcon}
				iconProps={{
					ui: {
						text: "2xl",
					},
				}}
				onClick={() => setIsOpen(true)}
				ui={{
					tone: "primary",
					theme: "light",
					color: "lead",
					background: undefined,
					border: false,
					shadow: false,
					...ui,
				}}
				{...props}
			/>

			<HomeMenuSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
};
