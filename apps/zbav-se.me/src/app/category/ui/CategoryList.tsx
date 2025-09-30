import { Button, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { CategoryListCls } from "~/app/category/ui/CategoryListCls";

export namespace CategoryList {
	export interface Props extends CategoryListCls.Props {
		list: CategorySchema.Type[];
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
					<Tx label={`Category ${item.name}`} />
				</Button>
			))}
		</div>
	);
};
