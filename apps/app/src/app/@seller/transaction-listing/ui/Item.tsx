import type { FC } from "react";
import { Data } from "./Item/Data";

export namespace Item {
	export interface Props extends Data.Props {
		//
	}
}

export const Item: FC<Item.Props> = (props) => {
	return <Data {...props} />;
};
