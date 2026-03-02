import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace CategoryInline {
	export interface Props extends Data.Props {
		//
	}
}

/**
 * Renders category data inline so it can fit dense UI rows without extra wrappers.
 * Use it where space is limited and category still needs to remain readable.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryInline: FC<CategoryInline.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
