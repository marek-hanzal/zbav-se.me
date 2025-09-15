import { Data, Scrollable, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Title } from "~/app/ui/title/Title";

export namespace TagSelection {
	export interface Props {
		categoryGroup: CategoryGroupSchema.Type;
	}
}

export const TagSelection: FC<TagSelection.Props> = ({ categoryGroup }) => {
	const categoryQuery = withCategoryListQuery().useQuery({
		where: {
			categoryGroupId: categoryGroup.id,
		},
		sort: [
			{
				value: "sort",
				sort: "asc",
			},
		],
	});

	return (
		<>
			<Title icon={TagIcon}>
				<Tx label={categoryGroup.name} />
			</Title>

			<Data<CategorySchema.Type[], typeof categoryQuery>
				result={categoryQuery}
				renderSuccess={({ data }) => {
					return (
						<Scrollable layout={"flex"}>
							<div
								className={tvc([
									"flex",
									"flex-col",
									"gap-4",
								])}
							>
								{data.map((item) => (
									<div
										key={item.id}
										className={tvc([
											"p-4",
											"bg-gray-100",
											"rounded-xl",
										])}
									>
										<Tx label={item.name} />
									</div>
								))}
							</div>
						</Scrollable>
					);
				}}
			/>
		</>
	);
};
