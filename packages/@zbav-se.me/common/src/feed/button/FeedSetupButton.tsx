import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";

export namespace FeedSetupButton {
	export interface Props extends Button.Props {
		//
	}
}

export const FeedSetupButton: FC<FeedSetupButton.Props> = ({ ...props }) => {
	return (
		<Button
			iconEnabled={SettingsIcon}
			label={"Feed setup (button)"}
			{...props}
		/>
	);
};
