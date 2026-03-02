import { CloseIcon } from "@use-pico/client/icon";
import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import { type FC, useMemo, useState } from "react";
import { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";

export namespace EditorSheet {
	export type Views = "detail";

	export interface Props extends BottomSheet.PropsEx {
		feedId: string;
		noDelete?: boolean;
		state: StateType.State<boolean>;
	}
}

export const EditorSheet: FC<EditorSheet.Props> = ({
	feedId,
	state,
	noDelete = false,
	children,
	...props
}) => {
	const [view, setView] = useState<EditorSheet.Views>("detail");

	const views = useMemo(() => {
		return {
			detail: {
				children: (
					<FeedEditor
						data-ui={"FeedEditorSheet-[FeedDetailEditor]"}
						feedId={feedId}
						noDelete={noDelete}
						ui={{
							inner: "default",
						}}
					>
						<Button
							onClick={() => state.set(false)}
							iconEnabled={CloseIcon}
							iconProps={{
								ui: {
									text: "xl",
								},
							}}
							ui={{
								tone: "neutral",
								theme: "light",
								size: "default",
								justify: "start",
								items: "center",
								background: "default",
								width: "full",
								round: undefined,
								shadow: false,
								border: false,
							}}
						>
							<Tx label="Close (button)" />
						</Button>

						{children}
					</FeedEditor>
				),
				header: () => ({
					title: translator.text("Feed setup (title)"),
				}),
			},
		};
	}, [
		children,
		feedId,
		noDelete,
		state,
	]);

	return (
		<SheetView<EditorSheet.Views>
			data-ui={"FeedEditorSheet[SheetView]"}
			isOpen={state.value}
			onClose={() => {
				state.set(false);
				setView("detail");
			}}
			detent={"default"}
			state={{
				value: view,
				set: setView,
			}}
			views={views}
			{...props}
		/>
	);
};
