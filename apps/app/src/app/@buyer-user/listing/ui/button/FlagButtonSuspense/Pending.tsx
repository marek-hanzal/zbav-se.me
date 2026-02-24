import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends ConfirmButton.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ ui, ...props }) => {
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
