import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace Item {
	export interface Props extends Data.Props {
		//
	}
}

export const Item: FC<Item.Props> = (props) => {
	return (
		<Suspense fallback={<Pending data-ui={"Item"} />}>
			<Data
				data-ui={"Item"}
				{...props}
			/>
		</Suspense>
	);
};
