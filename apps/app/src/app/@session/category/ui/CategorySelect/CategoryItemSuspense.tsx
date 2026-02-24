import { type FC, Suspense } from "react";
import { Data } from "./CategoryItemSuspense/Data";
import { Pending } from "./CategoryItemSuspense/Pending";

export namespace CategoryItemSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {}
}

export const CategoryItemSuspense: FC<CategoryItemSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
