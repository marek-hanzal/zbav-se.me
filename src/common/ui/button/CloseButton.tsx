import type { FC } from "react";
import { CloseDrawerIcon } from "~/ui/constant/CloseDrawerIcon";
import { Button } from "~/ui/ui/Button";
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
			{...uiBackButton({
				"data-ui-background": undefined,
				"data-ui-shadow": false,
				"data-ui-border": false,
				className,
			})}
			{...props}
		/>
	);
};
