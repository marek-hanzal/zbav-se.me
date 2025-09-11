import { Button, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { CategoryListCls } from "~/app/category-group/ui/CategoryListCls";

export namespace CategoryList {
	export interface Props extends CategoryListCls.Props {
		list: CategoryGroupSchema.Type[];
	}
}

export const CategoryList: FC<CategoryList.Props> = ({
	cls = CategoryListCls,
	tweak,
	list,
}) => {
	const slots = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			{list.map((item) => (
				<Button
					key={item.id}
					tone={"secondary"}
					size={"xl"}
					tweak={({ what }) => ({
						slot: what.slot({
							wrapper: what.css([
								"w-full",
							]),
							root: what.css([
								"w-full",
							]),
						}),
					})}
					round={"xl"}
				>
					<Tx label={`Category group ${item.name}`} />
				</Button>
			))}
		</div>
	);
};
