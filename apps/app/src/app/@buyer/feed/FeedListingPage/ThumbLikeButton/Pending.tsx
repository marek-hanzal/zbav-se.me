import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends Button.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ ui, ...props }) => {
	return (
		<Button
			disabled
			loading
			ui={{
				tone: "secondary",
				theme: "light",
				size: "default",
				justify: "start",
				...ui,
			}}
			{...props}
		>
			<Tx label="Loading... (button)" />
		</Button>
	);
};
