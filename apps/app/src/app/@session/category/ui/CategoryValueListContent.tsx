import type { MarkSuspense } from "@use-pico/client/type";
import { ValueList } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tCategoryItem, tCategoryQuery } from "@zbav-se.me/sdk/api/session";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { CategoryInlineSuspense } from "~/app/@session/category/ui/CategoryValueListContent/CategoryInlineSuspense";

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
	const query: tCategoryQuery = {
		where: {
			idIn: categoryIdIn,
		},
	};
	const { data: categoryIds } = withCategoryQuery.useCollectionQuery(query);
	const items: EntitySchema.Type[] = categoryIds.map((id) => ({ id }));

	return (
		<ValueList<EntitySchema.Type>
			renderFn={(item) => <CategoryInlineSuspense categoryId={item.id} />}
			items={items}
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
