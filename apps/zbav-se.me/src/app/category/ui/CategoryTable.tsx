import {
	ActionClick,
	ActionMenu,
	EditIcon,
	Table,
	TrashIcon,
	Tx,
	withColumn,
} from "@use-pico/client";
import type { FC } from "react";
import type { CategoryQuerySchema } from "~/app/category/db/CategoryQuerySchema";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryCountQuery } from "~/app/category/query/withCategoryCountQuery";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";

const { create, filter } = withColumn<
	CategoryQuerySchema.Type,
	CategorySchema.Type
>();

const columns = [
	create({
		name: "id",
		header: () => <Tx label={"ID"} />,
		render: ({ value }) => value,
		size: 18,
	}),
	create({
		name: "name",
		header: () => <Tx label={"Name"} />,
		render: ({ value }) => value,
		filter: filter.equal({
			value: "name",
			from: "name",
		}),
		sort: {
			value: "name",
		},
		size: 24,
	}),
	create({
		name: "sort",
		header: () => <Tx label={"Sort"} />,
		render: ({ value }) => value,
		sort: {
			value: "sort",
		},
		size: 12,
	}),
];

export namespace CategoryTable {
	export interface Props
		extends Table.PropsEx<CategoryQuerySchema.Type, CategorySchema.Type> {
		//
	}
}

export const CategoryTable: FC<CategoryTable.Props> = (props) => {
	return (
		<Table
			withQuery={withCategoryListQuery()}
			withCountQuery={withCategoryCountQuery()}
			context={{}}
			columns={columns}
			toolbar={() => {
				return (
					<ActionMenu withOverlay>
						<ActionClick icon={EditIcon}>
							<Tx label={"Add"} />
						</ActionClick>
					</ActionMenu>
				);
			}}
			actionTable={() => {
				return (
					<ActionMenu withOverlay>
						<ActionClick icon={EditIcon}>
							<Tx label={"Add"} />
						</ActionClick>

						<ActionClick
							icon={TrashIcon}
							tweak={{
								variant: {
									tone: "danger",
								},
							}}
						>
							<Tx label={"Remove all"} />
						</ActionClick>
					</ActionMenu>
				);
			}}
			actionRow={() => {
				return (
					<ActionMenu withOverlay>
						<ActionClick icon={EditIcon}>
							<Tx label={"Edit"} />
						</ActionClick>
					</ActionMenu>
				);
			}}
			{...props}
		/>
	);
};
