import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";

export namespace AcceptButton {
	export interface Props extends Button.Props {
		//
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ ...props }) => {
	return (
		<Button
			size={"xl"}
			full
			label={"Accept transaction (label)"}
			{...props}
		/>
	);
};
