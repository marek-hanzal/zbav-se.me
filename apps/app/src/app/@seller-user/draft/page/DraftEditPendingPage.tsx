import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace DraftEditPendingPage {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const DraftEditPendingPage: FC<DraftEditPendingPage.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
