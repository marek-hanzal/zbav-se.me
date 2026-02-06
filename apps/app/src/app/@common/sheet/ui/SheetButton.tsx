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
	// biome-ignore lint/correctness/useExhaustiveDependencies: One-time-effect
	useEffect(() => {
		const id = setTimeout(() => {
			state.set(defaultOpen);
		}, 100);

		return () => {
			clearTimeout(id);
		};
	}, []);

	return (
		<Button
			iconEnabled={SettingsIcon}
			onClick={() => state.set((prev) => !prev)}
			{...props}
		/>
	);
};
