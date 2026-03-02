import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace CategoryItem {
	export interface Props extends Omit<Data.Props, "_suspense"> {}
}

/**
 * Wraps the async category row renderer with suspense so each option can resolve independently.
 * Use it inside category selection lists where option rows load translated labels or metadata on demand.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
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
