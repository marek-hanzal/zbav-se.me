import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { CategoryInline } from "~/app/@common/category/ui/CategoryInline";

export namespace Data {
	export interface Props {
		categoryId: string;
	}
}

export const Data: FC<Data.Props> = ({ categoryId }) => {
	const { data: category } = withCategoryQuery.useQuery(categoryId);

	return <CategoryInline category={category} />;
};
