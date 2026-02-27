import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { Container } from "@use-pico/client/ui/container";
import type { StateType } from "@use-pico/common/type";
import type { FC } from "react";

export namespace FeedSetupButton {
	export interface Props extends Partial<Button.Props> {
		state: StateType.State<boolean>;
		label?: string;
	}
}

export const FeedSetupButton: FC<FeedSetupButton.Props> = ({ state, label, ui, ...props }) => {
	return (
		<Button
			data-ui={"FeedSetupButton[SheetButton]"}
			iconEnabled={SettingsIcon}
			onClick={() => state.set((prev) => !prev)}
			ui={{
				tone: "secondary",
				theme: "light",
				background: "default",
				justify: "center",
				items: "center",
				square: "default",
				zIndex: true,
				round: "full",
				snapTo: "top-right",
				text: "xl",
				opacity: "8",
				...ui,
			}}
			{...props}
		/>
	);
};

export const FeedStatusContainerUi: Container.Props["ui"] = {
	layout: "vertical-centered",
	height: "full",
};
