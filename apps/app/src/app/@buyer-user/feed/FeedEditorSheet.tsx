import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { StateType } from "@use-pico/common/type";
import type { FC } from "react";
import { FeedEditor } from "./FeedEditor/FeedEditor";

export namespace FeedEditorSheet {
	export interface Props extends FeedEditor.Props {
		state: StateType.Simple<boolean>;
	}
}

export const FeedEditorSheet: FC<FeedEditorSheet.Props> = ({ state, ...props }) => {
	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => {
				state.set(false);
			}}
		>
			<FeedEditor {...props} />
		</BottomSheet>
	);
};
