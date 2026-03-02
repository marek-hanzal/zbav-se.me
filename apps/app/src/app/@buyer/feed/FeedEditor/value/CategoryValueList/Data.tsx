import type { MarkSuspense } from "@use-pico/client/type";
import { ValueList } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tCategoryItem } from "@zbav-se.me/sdk/api/session";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { CategoryInline } from "~/app/@session/category/ui/CategoryInline/CategoryInline";

export namespace Data {
	export interface Props
		extends Omit<ValueList.Props<tCategoryItem>, "items" | "renderFn">,
			MarkSuspense.Props {
		categoryIdIn: string[];
	}
}

export const Data: FC<Data.Props> = ({ _suspense, categoryIdIn, ...props }) => {
	const { data: categoryIds } = withCategoryQuery.useCollectionQuery({
		where: {
			idIn: categoryIdIn,
		},
	});

	return (
		<ValueList<EntitySchema.Type>
			renderFn={(item) => <CategoryInline categoryId={item.id} />}
			items={categoryIds.map((id) => ({
				id,
			}))}
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
