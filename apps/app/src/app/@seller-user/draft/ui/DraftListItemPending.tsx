import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace DraftListItemPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const DraftListItemPending: FC<DraftListItemPending.Props> = (props) => {
	return (
		<SpinnerContainer
			data-ui="DraftList-[SpinnerContainer]"
			type="icon"
			{...props}
		/>
	);
};
