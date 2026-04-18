import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { CloseDrawerIcon } from "@/lib/client/icon";
import { uiBackButton } from "../ui/uiBackButton";

export namespace CloseButton {
	export interface Props extends Button.Props {
		//
	}
}

export const CloseButton: FC<CloseButton.Props> = ({ className, ...props }) => {
	return (
		<Button
			iconEnabled={CloseDrawerIcon}
			onClick={close}
			{...uiBackButton({
				ui: {
					background: undefined,
					shadow: false,
					border: false,
					...ui,
				},
				className,
			})}
			{...props}
		/>
	);
};
