import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends ConfirmButton.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ ui, ...props }) => {
	return (
		<ConfirmButton
			loading
			ui={{
				round: undefined,
				border: false,
				shadow: false,
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Tx label="Loading... (button)" />
		</ConfirmButton>
	);
};
