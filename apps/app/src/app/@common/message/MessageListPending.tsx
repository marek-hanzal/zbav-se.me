import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace MessageListPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const MessageListPending: FC<MessageListPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
