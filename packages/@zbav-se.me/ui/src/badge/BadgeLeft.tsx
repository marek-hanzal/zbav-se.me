import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";

export namespace BadgeLeft {
	export interface Props extends Button.Props {}
}

export const BadgeLeft: FC<BadgeLeft.Props> = (props) => {
	return (
		<Button
			iconEnabled={ArrowLeftIcon}
			iconProps={{
				size: "sm",
			}}
			round={"full"}
			tone={"secondary"}
			theme={"light"}
			{...props}
		/>
	);
};
