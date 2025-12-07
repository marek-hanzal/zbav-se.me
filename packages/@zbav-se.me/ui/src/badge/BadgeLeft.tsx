import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import type { FC } from "react";

export namespace BadgeLeft {
	export interface Props extends Badge.Props {
		//
	}
}

export const BadgeLeft: FC<BadgeLeft.Props> = (props) => {
	return (
		<Badge
			data-ui={"BadgeLeft-root"}
			//
			round={"full"}
			tone={"secondary"}
			theme={"light"}
			{...props}
		>
			<Icon
				data-ui={"BadgeLeft-Icon"}
				icon={ArrowLeftIcon}
				size={"sm"}
			/>
		</Badge>
	);
};
