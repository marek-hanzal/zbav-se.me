import type { FC } from "react";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { Icon } from "~/ui/ui/Icon";

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
