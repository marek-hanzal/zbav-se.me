import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useEffect, useState } from "react";
import { Feed } from "~/app/feed/ui/Feed";
import { LocationPatch } from "~/app/feed/ui/patch/LocationPatch";
import { NamePatch } from "~/app/feed/ui/patch/NamePatch";

export namespace SetupButton {
	export type Views = "detail" | "name" | "location";
	// | "sort"
	// | "category"
	// | "condition"
	// | "age"
	// | "gallery";

	export interface Props extends Button.Props {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
		noDelete: boolean | undefined;
		state: StateType.State<boolean>;
	}
}

export const SetupButton: FC<SetupButton.Props> = ({
	locale,
	feed,
	defaultOpen,
	noDelete,
	state,
	children,
	ui,
	...props
}) => {
	const [view, setView] = useState<SetupButton.Views>("detail");

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
				data-ui={"FeedSetupButton[Button]"}
				iconEnabled={SettingsIcon}
				label={"Feed setup (button)"}
				onClick={() => state.set((prev) => !prev)}
				ui={{
					...ui,
				}}
				{...props}
			/>

			<SheetView<SetupButton.Views>
				data-ui={"FeedSetupButton-[BottomSheet]"}
				isOpen={state.value}
				onClose={() => state.set(false)}
				detent={"full"}
				state={{
					value: view,
					set: setView,
				}}
				views={{
					detail: {
						children: (
							<Feed
								data-ui={"FeedSetupButton-[FeedDetailContainer]"}
								locale={locale}
								feed={feed}
								noDelete={noDelete}
								ui={{
									inner: "default",
								}}
								values={{
									name: {
										onClick: () => setView("name"),
									},
									location: {
										onClick: () => setView("location"),
									},
								}}
							>
								{children}
							</Feed>
						),
						header: ({ close }) => ({
							title: feed.name,
							right: <CloseButton onClick={close} />,
						}),
					},
					name: {
						children: (
							<NamePatch
								feed={feed}
								onSettled={() => setView("detail")}
							/>
						),
						header: () => ({
							title: translator.text("Feed setup - name (title)"),
							right: <CloseButton onClick={() => setView("detail")} />,
						}),
					},
					location: {
						children: (
							<LocationPatch
								locale={locale}
								feed={feed}
								onSettled={() => setView("detail")}
							/>
						),
						header: () => ({
							title: translator.text("Feed location (title)"),
							right: <CloseButton onClick={() => setView("detail")} />,
						}),
					},
				}}
			/>
		</>
	);
};
