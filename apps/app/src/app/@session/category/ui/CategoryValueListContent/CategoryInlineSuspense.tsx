import { type FC, Suspense } from "react";
import { Data } from "~/app/@session/category/ui/CategoryValueListContent/CategoryInlineSuspense/Data";
import { Pending } from "~/app/@session/category/ui/CategoryValueListContent/CategoryInlineSuspense/Pending";

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
