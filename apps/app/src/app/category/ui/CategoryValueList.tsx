import { ContainerValueList } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { type FC, Suspense } from "react";

// biome-ignore lint/correctness/noUnusedVariables: Private
namespace CategoryList {
	export interface Props extends Omit<ContainerValueList.Props<tCategory>, "items" | "render"> {
		categoryIdIn: string[];
	}
}

const CategoryList: FC<CategoryList.Props> = ({ categoryIdIn, ...props }) => {
	const categoryCollectionQuery = withCategoryCollectionQuery.useSuspenseQuery({
		where: {
			idIn: categoryIdIn,
		},
	});

	return (
		<ContainerValueList
			render={(category) => (
				<div className={"flex flex-col gap-0.5 items-start"}>
					<Typo
						label={category.group}
						size={"xs"}
					/>
					<Typo label={category.category} />
				</div>
			)}
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
