import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { LocationIcon } from "~/common/ui/icon";

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
