import { type FC, Suspense } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { translator } from "@/lib/common/translator";
import type { StateType } from "@use-pico/common/type";
import { CloseButton } from "~/common/ui/button";
import { FeedEditor } from "./FeedEditor";

export namespace FeedEditorSheet {
	export interface Props extends Omit<FeedEditor.Props, "_suspense"> {
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
			header={({ close }) => ({
				title: translator.text("Feed editor (title)"),
				right: (
					<CloseButton
						data-action={"close feed editor"}
						onClick={close}
						ui={{
							background: undefined,
							shadow: false,
							border: false,
						}}
					/>
				),
			})}
		>
			<Suspense fallback={<FeedEditor.Fallback />}>
				<FeedEditor
					{...props}
					_suspense={"I know"}
				/>
			</Suspense>
		</BottomSheet>
	);
};
