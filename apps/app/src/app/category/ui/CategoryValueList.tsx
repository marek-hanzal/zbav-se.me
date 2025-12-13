import { ContainerValueList } from "@use-pico/client/ui/container";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { CategoryInline } from "./CategoryInline";

export namespace CategoryValueList {
	export interface Props extends Omit<ContainerValueList.Props<tCategory>, "items" | "renderFn"> {
		categoryIdIn: string[] | undefined | null;
	}
}

export const CategoryValueList: FC<CategoryValueList.Props> = ({ categoryIdIn, ...props }) => {
	if (!categoryIdIn || categoryIdIn.length === 0) {
		return (
			<ContainerValueList
				renderFn={() => null}
				items={[]}
				loading={true}
				{...props}
			/>
		);
	}

	return (
		<withCategoryCollectionQuery.Suspense
			data={{
				where: {
					idIn: categoryIdIn,
				},
			}}
			fallback={
				<ContainerValueList
					renderFn={() => null}
					items={[]}
					loading={true}
					{...props}
				/>
			}
		>
			{({ data }) => {
				return (
					<ContainerValueList
						renderFn={(category) => <CategoryInline category={category} />}
						items={data.data}
						{...props}
					/>
				);
			}}
		</withCategoryCollectionQuery.Suspense>
	);
};
