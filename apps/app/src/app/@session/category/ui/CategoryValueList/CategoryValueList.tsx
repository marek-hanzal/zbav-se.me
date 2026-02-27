import { ValueList } from "@use-pico/client/ui/container";
import type { tCategoryItem } from "@zbav-se.me/sdk/api/session";
import { type FC, Suspense } from "react";
import { CategoryValueListContent } from "~/app/v0/@session/category/ui/CategoryValueListContent";
import { CategoryValueListContentPending } from "~/app/v0/@session/category/ui/CategoryValueListContentPending";

export namespace CategoryValueList {
	export interface Props extends Omit<ValueList.Props<tCategoryItem>, "items" | "renderFn"> {
		categoryIdIn: string[] | undefined | null;
	}
}

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
		<Suspense fallback={<CategoryValueListContentPending {...props} />}>
			<CategoryValueListContent
				_suspense={"I know"}
				categoryIdIn={categoryIdIn}
				{...props}
			/>
		</Suspense>
	);
};
