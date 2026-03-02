import { ValueList } from "@use-pico/client/ui/container";
import type { tCategoryItem } from "@zbav-se.me/sdk/api/session";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace CategoryValueList {
	export interface Props extends Omit<ValueList.Props<tCategoryItem>, "items" | "renderFn"> {
		categoryIdIn: string[] | undefined | null;
	}
}

/**
 * Renders a read-only list of category values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple category entries clearly.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryValueList: FC<CategoryValueList.Props> = ({ categoryIdIn, ...props }) => {
	if (!categoryIdIn || categoryIdIn.length === 0) {
		return (
			<ValueList<tCategoryItem>
				renderFn={() => null}
				items={[]}
				{...props}
			/>
		);
	}

	return (
		<Suspense fallback={<Pending {...props} />}>
			<Data
				_suspense={"I know"}
				categoryIdIn={categoryIdIn}
				{...props}
			/>
		</Suspense>
	);
};
