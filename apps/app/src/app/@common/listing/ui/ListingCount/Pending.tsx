import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends Icon.PropsEx {
		//
	}
}

export const Pending: FC<Pending.Props> = (props) => {
	return (
		<Icon
			icon={SpinnerIcon}
			{...props}
		/>
	);
};
