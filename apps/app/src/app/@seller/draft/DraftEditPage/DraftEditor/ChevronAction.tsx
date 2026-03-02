import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import type { FC } from "react";

export namespace ChevronAction {
	export interface Props extends Icon.PropsEx {}
}

export const ChevronAction: FC<ChevronAction.Props> = (props) => {
	return (
		<Icon
			icon={ChevronRightIcon}
			ui={{
				text: "xl",
			}}
			{...props}
		/>
	);
};
