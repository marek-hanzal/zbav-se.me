import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, useState } from "react";
import { createEditorSheetViews } from "./EditorSheet/createEditorSheetViews";

export namespace EditorSheet {
	export type Views =
		| "detail"
		| "name"
		| "category"
		| "location"
		| "range"
		| "sort"
		| "condition"
		| "age"
		| "delivery"
		| "warranty"
		| "gallery"
		| "title";

	export interface Props extends BottomSheet.PropsEx {
		feed: tFeed;
		noDelete?: boolean;
		state: StateType.State<boolean>;
	}
}

export const EditorSheet: FC<EditorSheet.Props> = ({
	feed,
	state,
	noDelete = false,
	children,
	...props
}) => {
	const [view, setView] = useState<EditorSheet.Views>("detail");

	return (
		<SheetView<EditorSheet.Views>
			data-ui={"FeedEditorSheet[SheetView]"}
			isOpen={state.value}
			onClose={() => {
				state.set(false);
				setView("detail");
			}}
			detent={"full"}
			state={{
				value: view,
				set: setView,
			}}
			views={createEditorSheetViews({
				feed,
				noDelete,
				children,
				state,
				setView,
			})}
			{...props}
		/>
	);
};
