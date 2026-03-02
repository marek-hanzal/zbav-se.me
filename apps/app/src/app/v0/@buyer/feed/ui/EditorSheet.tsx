import { CloseIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { FC } from "react";
import { FeedEditor } from "~/app/v0/@buyer/feed/ui/FeedEditor";

export namespace EditorSheet {
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
	return (
		<BottomSheet
			data-ui={"FeedEditorSheet[SheetView]"}
			isOpen={state.value}
			onClose={() => {
				state.set(false);
			}}
			detent={"default"}
			title={translator.text("Feed setup (title)")}
			{...props}
		>
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
		</BottomSheet>
	);
};
