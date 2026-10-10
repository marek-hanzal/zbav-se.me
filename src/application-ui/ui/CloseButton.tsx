import type { FC } from "react";
import { uiBackButtonFn } from "~/application-ui/fn/uiBackButtonFn";
import { CloseDrawerIcon } from "~/ui/constant/CloseDrawerIcon";
import { Button } from "~/ui/ui/Button";

export namespace CloseButton {
	export interface Props extends Button.Props {
		//
	}
}

export const CloseButton: FC<CloseButton.Props> = ({ className, ...props }) => {
	return (
		<Button
			iconEnabled={CloseDrawerIcon}
			{...uiBackButtonFn({
				"data-ui-background": undefined,
				"data-ui-shadow": false,
				"data-ui-border": false,
				className,
			})}
			{...props}
		/>
	);
};
