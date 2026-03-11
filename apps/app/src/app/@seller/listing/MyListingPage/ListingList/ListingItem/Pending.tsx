import type { FC } from "react";
import { ListItemPending } from "~/app/@common/list-item/ListItemPending";

export namespace Pending {
	export interface Props extends ListItemPending.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = (props) => {
	return <ListItemPending {...props} />;
};
