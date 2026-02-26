import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import type { FC } from "react";

export namespace ChevronAction {
	export type Props = {};
}

export const ChevronAction: FC<ChevronAction.Props> = () => {
	return (
		<Icon
			icon={ChevronRightIcon}
			ui={{
				text: "xl",
			}}
		/>
	);
};
