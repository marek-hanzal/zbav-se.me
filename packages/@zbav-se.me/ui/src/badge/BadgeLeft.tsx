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
			round={"full"}
			tone={"secondary"}
			theme={"light"}
			className={[
				"w-10",
				"h-10",
			]}
			{...props}
		>
			<Icon
				icon={ArrowLeftIcon}
				size={"sm"}
			/>
		</Badge>
	);
};
