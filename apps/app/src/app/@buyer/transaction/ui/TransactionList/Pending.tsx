import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
