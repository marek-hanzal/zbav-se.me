import type { FC } from "react";
import { ChevronRightIcon, Icon } from "@/lib/client/icon";

export namespace ChevronAction {
	export interface Props extends Icon.PropsEx {
		//
	}
}

export const ChevronAction: FC<ChevronAction.Props> = (props) => {
	return (
		<Icon
			icon={ChevronRightIcon}
			data-ui-text="xl"
			{...props}
		/>
	);
};
