import type { FC } from "react";
import { Button } from "@/lib/client/button";
import type { Icon } from "@/lib/client/icon";

export namespace Item {
	export interface Props extends Button.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
	}
}

export const Item: FC<Item.Props> = ({ icon, ...props }) => {
	return (
		<Button
			data-ui={"Item[Button]"}
			iconEnabled={icon}
			iconProps={{
				"data-ui-text": "2xl",
			}}
			data-ui-tone="subtle"
			data-ui-theme="light"
			data-ui-size="xl"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-height="full"
			data-ui-width="full"
			{...props}
		/>
	);
};
