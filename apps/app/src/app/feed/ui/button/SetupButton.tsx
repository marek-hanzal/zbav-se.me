import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, useEffect } from "react";

export namespace SetupButton {
	export interface Props extends Button.Props {
		feed: tFeed;
		defaultOpen: boolean;
		state: StateType.State<boolean>;
	}
}

export const SetupButton: FC<SetupButton.Props> = ({ feed, defaultOpen, state, ui, ...props }) => {
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
			data-ui={"FeedSetupButton[Button]"}
			iconEnabled={SettingsIcon}
			label={"Feed setup (button)"}
			onClick={() => state.set((prev) => !prev)}
			ui={{
				...ui,
			}}
			{...props}
		/>
	);
};
