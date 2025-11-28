import { Button } from "@use-pico/client/ui/button";
import { MessageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace MessageButton {
	export interface Props extends Button.Props {
		//
	}
}

export const MessageButton: FC<MessageButton.Props> = ({ ...props }) => {
	return (
		<Button
			iconEnabled={MessageIcon}
			menu
			{...props}
		/>
	);
};
