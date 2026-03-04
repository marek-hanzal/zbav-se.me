import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
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
			title={translator.text("Loading... (label)")}
			bottom={undefined}
			{...props}
		>
			<SpinnerContainer
				type={"icon"}
				ui={{
					snapTo: "middle",
				}}
			/>
		</ListItem>
	);
};
