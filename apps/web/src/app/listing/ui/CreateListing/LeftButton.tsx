import { ArrowLeftIcon, Button, type useSnapperNav } from "@use-pico/client";
import type { FC } from "react";

export namespace LeftButton {
	export interface Props extends Button.Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const LeftButton: FC<LeftButton.Props> = ({
	listingNavApi,
	...props
}) => {
	return (
		<Button
			iconEnabled={ArrowLeftIcon}
			iconPosition={"left"}
			tone={"secondary"}
			theme={"light"}
			size={"sm"}
			background={false}
			border={false}
			onClick={listingNavApi.prev}
			{...props}
		/>
	);
};
