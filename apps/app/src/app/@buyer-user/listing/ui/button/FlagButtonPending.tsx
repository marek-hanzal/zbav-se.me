import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace FlagButtonPending {
	export interface Props extends ConfirmButton.Props {
		//
	}
}

export const FlagButtonPending: FC<FlagButtonPending.Props> = ({ ui, ...props }) => {
	return (
		<ConfirmButton
			label={translator.text("Loading... (button)")}
			disabled
			loading
			ui={{
				tone: "primary",
				theme: "light",
				size: "xl",
				justify: "start",
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
