import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace FeedEditorSheetPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const FeedEditorSheetPending: FC<FeedEditorSheetPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
