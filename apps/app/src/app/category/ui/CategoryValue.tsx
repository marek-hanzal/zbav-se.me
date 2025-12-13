import { ValueList } from "@use-pico/client/ui/container";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { CategoryInline } from "./CategoryInline";

export namespace CategoryValue {
	export interface Props extends Omit<ValueList.Props<tCategory>, "items" | "renderFn"> {
		categoryIdIn: string[] | undefined | null;
	}
}

export const CategoryValue: FC<CategoryValue.Props> = ({ categoryIdIn, ...props }) => {
	if (!categoryIdIn || categoryIdIn.length === 0) {
		return (
			<ValueList
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
				<ValueList
					renderFn={() => null}
					items={[]}
					loading={true}
					{...props}
				/>
			}
		>
			{({ data }) => {
				return (
					<ValueList
						renderFn={(category) => <CategoryInline category={category} />}
						items={data.data}
						{...props}
					/>
				);
			}}
		</withCategoryCollectionQuery.Suspense>
	);
};
