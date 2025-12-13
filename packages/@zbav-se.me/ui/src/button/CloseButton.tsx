import { CloseIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";
import { uiBackButton } from "../ui/uiBackButton";

export namespace CloseButton {
	export interface Props extends Button.Props {
		//
	}
}

export const CloseButton: FC<CloseButton.Props> = ({ ui, className, ...props }) => {
	return (
		<Button
			iconEnabled={CloseIcon}
			onClick={close}
			{...uiBackButton({
				ui,
				className,
			})}
			{...props}
		/>
	);
};
