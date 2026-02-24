import { ValueList } from "@use-pico/client/ui/container";
import type { MarkSuspense } from "@use-pico/client/type";
import type { tCategoryItem } from "@zbav-se.me/sdk/api/session";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { CategoryInline } from "~/app/@common/category/ui/CategoryInline";

export namespace CategoryValueListContent {
	export interface Props
		extends Omit<ValueList.Props<tCategoryItem>, "items" | "renderFn">,
			MarkSuspense.Props {
		categoryIdIn: string[];
	}
}

export const CategoryValueListContent: FC<CategoryValueListContent.Props> = ({
	_suspense,
	categoryIdIn,
	...props
}) => {
	const { data } = withCategoryCollectionQuery.useSuspenseQuery({
		where: {
			idIn: categoryIdIn,
		},
	});

	return (
		<ValueList<tCategoryItem>
			renderFn={(category) => <CategoryInline category={category} />}
			items={data}
			wrapperProps={{
				ui: {
					tone: "neutral",
					theme: "light",
				},
			}}
			{...props}
		/>
	);
};
