import { type FC, Suspense } from "react";
import { Data } from "./CategoryInlineSuspense/Data";
import { Pending } from "./CategoryInlineSuspense/Pending";

export namespace CategoryInlineSuspense {
	export interface Props extends Data.Props {}
}

export const CategoryInlineSuspense: FC<CategoryInlineSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
