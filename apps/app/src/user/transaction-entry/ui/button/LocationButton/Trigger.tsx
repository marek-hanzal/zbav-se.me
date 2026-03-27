import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { LocationIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace Trigger {
	export interface Props extends Button.Props {
		onOpen(): void;
	}
}

export const Trigger: FC<Trigger.Props> = ({ onOpen, ...props }) => {
	return (
		<Button
			data-ui="LocationButton[Button]"
			iconEnabled={LocationIcon}
			onClick={onOpen}
			{...props}
		>
			<Tx label="Share location (button)" />
		</Button>
	);
};
