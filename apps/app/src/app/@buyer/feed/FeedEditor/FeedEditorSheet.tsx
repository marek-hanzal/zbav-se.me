import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { FeedEditor } from "./FeedEditor";

export namespace FeedEditorSheet {
	export interface Props extends BottomSheet.Props {
		feedId: string;
	}
}

export const FeedEditorSheet: FC<FeedEditorSheet.Props> = ({ feedId, ...props }) => {
	return (
		<BottomSheet
			data-ui={"FeedEditorSheet[SheetView]"}
			detent={"default"}
			title={translator.text("Feed setup (title)")}
			{...props}
		>
			<FeedEditor feedId={feedId} />
		</BottomSheet>
	);
};
