import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace Pending {
	export interface Props extends ListItem.PropsEx {
		//
	}
}

export const Pending: FC<Pending.Props> = (props) => {
	return (
		<ListItem
			hero={undefined}
			title={undefined}
			bottom={undefined}
			{...props}
		>
			<SpinnerContainer
				ui={{
					snapTo: "middle",
				}}
				type={"icon"}
				iconProps={{
					ui: {
						text: "2xl",
					},
				}}
			/>
		</ListItem>
	);
};
