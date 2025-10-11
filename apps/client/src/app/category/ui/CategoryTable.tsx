import {
	ActionClick,
	ActionMenu,
	EditIcon,
	Table,
	TrashIcon,
	Tx,
	withColumn,
} from "@use-pico/client";
import type { Category, CategoryQuery } from "@zbav-se.me/sdk";
import type { FC } from "react";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { withCategoryCountQuery } from "../query/withCategoryCountQuery";

const { create, filter } = withColumn<CategoryQuery, Category>();

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
	export interface Props extends Table.PropsEx<CategoryQuery, Category> {
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
