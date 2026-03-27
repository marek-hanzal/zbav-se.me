import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { ListItem } from "./ListItem";

export namespace ListItemPending {
	export interface Props extends ListItem.PropsEx {
		//
	}
}

export const ListItemPending: FC<ListItemPending.Props> = (props) => {
	return (
		<ListItem
			hero={undefined}
			title={undefined}
			bottom={undefined}
			{...props}
		>
			<SpinnerContainer
				type={"icon"}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				ui={{
					snapTo: "middle",
				}}
			/>
		</ListItem>
	);
};
