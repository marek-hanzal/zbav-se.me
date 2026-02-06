import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { StateType } from "@use-pico/common/type";
import { type FC, useEffect } from "react";

export namespace SheetButton {
	export interface Props extends Button.Props {
		defaultOpen: boolean;
		state: StateType.State<boolean>;
	}
}

export const SheetButton: FC<SheetButton.Props> = ({ defaultOpen, state, ...props }) => {
	useEffect(() => {
		setTimeout(() => {
			state.set(defaultOpen);
		}, 100);
	}, [
		defaultOpen,
		state.set,
	]);

	return (
		<Button
			iconEnabled={SettingsIcon}
			onClick={() => state.set((prev) => !prev)}
			{...props}
		/>
	);
};
