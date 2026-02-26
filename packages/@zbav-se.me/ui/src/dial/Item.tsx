import type { Icon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";

export namespace Item {
	export interface Props extends Button.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
	}
}

export const Item: FC<Item.Props> = ({ icon, ui, ...props }) => {
	return (
		<Button
			data-ui={"Item[Button]"}
			iconEnabled={icon}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
			ui={{
				tone: "neutral",
				theme: "light",
				size: "xl",
				items: "center",
				justify: "center",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		/>
	);
};
