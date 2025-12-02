import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import type { FC } from "react";

export namespace BadgeLeft {
	export interface Props extends Badge.Props {}
}

export const BadgeLeft: FC<BadgeLeft.Props> = (props) => {
	return (
		<Badge
			tone={"secondary"}
			theme={"light"}
			size={"lg"}
			round={"full"}
			tweak={{
				slot: {
					root: {
						class: [
							"p-2",
							"opacity-65",
							"border-none",
							"h-fit",
						],
					},
				},
			}}
			{...props}
		>
			<Icon icon={ArrowLeftIcon} />
		</Badge>
	);
};
