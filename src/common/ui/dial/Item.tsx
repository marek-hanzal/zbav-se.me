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
				ui: {
					text: "2xl",
				},
			}}
			ui={{
				tone: "subtle",
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
