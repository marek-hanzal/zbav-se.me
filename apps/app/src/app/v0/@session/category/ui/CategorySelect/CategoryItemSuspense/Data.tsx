import type { useSelection } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Typo } from "@use-pico/client/ui/typo";
import type { EntitySchema } from "@use-pico/common/schema";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		categoryId: string;
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, categoryId, selection }) => {
	const { data: item } = withCategoryQuery.useQuery(categoryId);
	const isSelected = selection.isSelected(item.id);

	return (
		<Button
			data-id={item.id}
			onClick={() => {
				selection.toggle(item);
			}}
			{...uiSelectButton({
				isSelected,
				className: undefined,
			})}
			data-ui="CategoryItem[Button]"
		>
			<Typo
				label={item.group}
				ui={{
					text: "sm",
				}}
			/>

			<Typo
				label={item.category}
				ui={{
					text: "lg",
					font: isSelected ? "bold" : "normal",
				}}
			/>
		</Button>
	);
};
