import type { MarkSuspense } from "@use-pico/client/type";
import { ContainerValueList } from "@use-pico/client/ui/container";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { type FC, Suspense } from "react";
import { CategoryInline } from "./CategoryInline";

// biome-ignore lint/correctness/noUnusedVariables: Private
namespace CategoryList {
	export interface Props
		extends Omit<ContainerValueList.Props<tCategory>, "items" | "render">,
			MarkSuspense.Props {
		categoryIdIn: string[];
	}
}

const CategoryList: FC<CategoryList.Props> = ({ _suspense, categoryIdIn, ...props }) => {
	const categoryCollectionQuery = withCategoryCollectionQuery.useSuspenseQuery({
		where: {
			idIn: categoryIdIn,
		},
	});

	return (
		<ContainerValueList
			render={(category) => <CategoryInline category={category} />}
			items={categoryCollectionQuery.data.data}
			{...props}
		/>
	);
};

export namespace CategoryValueList {
	export interface Props extends Omit<ContainerValueList.Props<tCategory>, "items" | "render"> {
		categoryIdIn: string[] | undefined | null;
	}
}

export const CategoryValueList: FC<CategoryValueList.Props> = ({ categoryIdIn, ...props }) => {
	return (
		<Suspense
			fallback={
				<ContainerValueList
					render={() => null}
					items={[]}
					loading={true}
					{...props}
				/>
			}
		>
			{categoryIdIn && categoryIdIn.length > 0 ? (
				<CategoryList
					_suspense={"I know"}
					categoryIdIn={categoryIdIn}
					{...props}
				/>
			) : (
				<ContainerValueList
					render={() => null}
					items={[]}
					{...props}
				/>
			)}
		</Suspense>
	);
};
