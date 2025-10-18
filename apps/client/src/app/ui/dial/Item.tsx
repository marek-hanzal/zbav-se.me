import { Button, type Icon } from "@use-pico/client";
import type { FC } from "react";
import type { DialCls } from "~/app/ui/dial/DialCls";

export namespace Item {
	export interface Props extends DialCls.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
		slots: DialCls.Slots;
	}
}

export const Item: FC<Item.Props> = ({ icon, disabled, onClick, slots }) => {
	return (
		<Button
			iconEnabled={icon}
			disabled={disabled}
			onClick={onClick}
			tone={"secondary"}
			size={"xl"}
		/>
	);
};
