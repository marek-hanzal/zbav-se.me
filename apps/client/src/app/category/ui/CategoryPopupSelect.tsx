import { Badge, More, PopupSelect, Tx } from "@use-pico/client";
import type { FC } from "react";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { CategoryTable } from "~/app/category/ui/CategoryTable";
import type { CategoryQuerySchema } from "../../../../../../packages/@zbav-se.me/common/src/category/CategoryQuerySchema";
import type { CategorySchema } from "../../../../../../packages/@zbav-se.me/common/src/category/CategorySchema";

export namespace CategoryPopupSelect {
	export interface Props
		extends PopupSelect.PropsEx<
			CategoryQuerySchema.Type,
			CategorySchema.Type
		> {
		//
	}
}

export const CategoryPopupSelect: FC<CategoryPopupSelect.Props> = (props) => {
	return (
		<PopupSelect
			withQuery={withCategoryListQuery()}
			table={CategoryTable}
			textTitle={<Tx label={"Select category (title)"} />}
			textSelect={<Tx label={"Select category (select)"} />}
			renderMulti={({ entities }) => (
				<More
					// limit={1}
					items={entities.map((entity) => ({
						id: entity.id,
						label: entity.name,
					}))}
					renderInline={({ entity }) => (
						<Badge
							key={`${entity.id}-inline`}
							tweak={{
								variant: {
									size: "xs",
									border: false,
								},
							}}
						>
							{entity.label}
						</Badge>
					)}
					renderItem={({ entity }) => (
						<Badge
							key={`${entity.id}-item`}
							tweak={{
								variant: {
									size: "xs",
								},
							}}
						>
							{entity.label}
						</Badge>
					)}
				/>
			)}
			{...props}
		/>
	);
};
