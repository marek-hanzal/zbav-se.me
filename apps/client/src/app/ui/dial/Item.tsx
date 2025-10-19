import { Button, type Icon } from "@use-pico/client";
import type { FC } from "react";

export namespace Item {
	export interface Props extends Button.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
	}
}

export const Item: FC<Item.Props> = ({ icon, disabled, onClick, ...props }) => {
	return (
		<Button
			iconEnabled={icon}
			disabled={disabled}
			onClick={onClick}
			tone={"primary"}
			size={"xl"}
			tweak={{
				slot: {
					wrapper: {
						class: [
							"w-full",
							"h-full",
						],
					},
					root: {
						class: [
							"w-full",
							"h-full",
						],
					},
				},
			}}
			{...props}
		/>
	);
};
