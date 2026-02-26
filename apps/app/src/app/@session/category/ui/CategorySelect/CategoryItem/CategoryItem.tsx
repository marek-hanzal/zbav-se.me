import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace CategoryItem {
	export interface Props extends Omit<Data.Props, "_suspense"> {}
}

export const CategoryItem: FC<CategoryItem.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
