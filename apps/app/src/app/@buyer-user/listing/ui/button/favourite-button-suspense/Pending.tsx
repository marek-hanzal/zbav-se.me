import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends Button.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ ui, ...props }) => {
	return (
		<Button
			label={translator.text("Loading... (button)")}
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
		/>
	);
};
