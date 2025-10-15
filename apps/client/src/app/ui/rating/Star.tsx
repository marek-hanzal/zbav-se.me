import { Icon } from "@use-pico/client";
import type { FC } from "react";
import { StarEmptyIcon } from "~/app/ui/icon/StarEmptyIcon";
import { StarIcon } from "~/app/ui/icon/StarIcon";

export namespace Star {
	export interface Props {
		selected: boolean;
		onClick: () => void;
	}
}

export const Star: FC<Star.Props> = ({ selected, onClick }) => {
	return (
		<Icon
			icon={selected ? StarIcon : StarEmptyIcon}
			onClick={onClick}
			tone={"secondary"}
			theme={"light"}
			size={"xl"}
			tweak={{
				slot: {
					root: {
						class: [
							"Star-root",
						],
					},
				},
			}}
		/>
	);
};
