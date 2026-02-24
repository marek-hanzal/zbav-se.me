import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace IgnoreButtonPending {
	export interface Props extends ConfirmButton.Props {
		//
	}
}

export const IgnoreButtonPending: FC<IgnoreButtonPending.Props> = ({ ui, ...props }) => {
	return (
		<ConfirmButton
			label={translator.text("Loading... (button)")}
			loading
			ui={{
				round: undefined,
				border: false,
				shadow: false,
				width: "full",
				...ui,
			}}
			{...props}
		/>
	);
};
