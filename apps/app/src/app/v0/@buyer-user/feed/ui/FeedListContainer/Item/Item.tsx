import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";
import type { View } from "./View";

export namespace Item {
	export type Tools = View.Tools;
	export type LinkTo = View.LinkTo;

	export interface Props extends Data.Props {
		//
	}
}

export const Item: FC<Item.Props> = (props) => {
	return (
		<Suspense fallback={<Pending {...props} />}>
			<Data {...props} />
		</Suspense>
	);
};
