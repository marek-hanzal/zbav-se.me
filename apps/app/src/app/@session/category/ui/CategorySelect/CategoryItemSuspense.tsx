import { type FC, Suspense } from "react";
import { Data } from "~/app/@session/category/ui/CategorySelect/CategoryItemSuspense/Data";
import { Pending } from "~/app/@session/category/ui/CategorySelect/CategoryItemSuspense/Pending";

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
