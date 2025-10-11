import { Button, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import type { FC } from "react";
import { CategoryListCls } from "~/app/category-group/ui/CategoryListCls";

export namespace CategoryList {
	export interface Props extends CategoryListCls.Props {
		list: CategoryGroup[];
	}
}

export const CategoryList: FC<CategoryList.Props> = ({
	cls = CategoryListCls,
	tweak,
	list,
}) => {
	const { slots } = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			{list.map((item) => (
				<Button
					key={item.id}
					tone={"secondary"}
					size={"xl"}
					tweak={{
						slot: {
							wrapper: {
								class: [
									"w-full",
								],
							},
							root: {
								class: [
									"w-full",
								],
							},
						},
					}}
					round={"xl"}
				>
					<Tx label={`Category group ${item.name}`} />
				</Button>
			))}
		</div>
	);
};
