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
				round: "full",
				square: "md",
				justify: "center",
				items: "center",
				size: undefined,
				inner: undefined,
				snapTo: "top-right",
				...ui,
			}}
			{...props}
		>
			<Tx label="Loading... (button)" />
		</Button>
	);
};
