import { SettingsIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { type FC, useEffect } from "react";
import { FeedDetailContainer } from "../FeedDetailContainer";

export namespace FeedSetupButton {
	export interface Props extends Button.Props {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
		noDelete: boolean | undefined;
		state: StateType.State<boolean>;
	}
}

export const FeedSetupButton: FC<FeedSetupButton.Props> = ({
	locale,
	feed,
	defaultOpen,
	noDelete,
	state,
	children,
	ui,
	...props
}) => {
	useEffect(() => {
		setTimeout(() => {
			state.set(defaultOpen);
		}, 100);
	}, [
		defaultOpen,
		state.set,
	]);

	return (
		<>
			<Button
				iconEnabled={SettingsIcon}
				ui={{
					size: "xl",
					...ui,
				}}
				label={"Feed setup (button)"}
				onClick={() => state.set((prev) => !prev)}
				{...props}
			/>

			<BottomSheet
				isOpen={state.value}
				onClose={() => state.set(false)}
				detent={"full"}
				header={{
					close: true,
					title: feed.name,
				}}
			>
				<FeedDetailContainer
					locale={locale}
					feed={feed}
					noDelete={noDelete}
				>
					{children}
				</FeedDetailContainer>
			</BottomSheet>
		</>
	);
};
