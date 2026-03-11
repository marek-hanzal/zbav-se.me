import { type FC, Suspense } from "react";
import { Data } from "./Item/Data";
import { Pending } from "./Item/Pending";

export namespace Item {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const Item: FC<Item.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
