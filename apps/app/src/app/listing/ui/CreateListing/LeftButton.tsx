import { ArrowLeftIcon, Button } from "@use-pico/client";
import type { FC } from "react";

export namespace LeftButton {
	export interface Props extends Button.Props {}
}

export const LeftButton: FC<LeftButton.Props> = (props) => {
	return (
		<Button
			iconEnabled={ArrowLeftIcon}
			iconPosition={"left"}
			tone={"secondary"}
			theme={"light"}
			size={"sm"}
			background={false}
			border={false}
			{...props}
		/>
	);
};
