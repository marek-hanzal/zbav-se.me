import { useParams } from "@tanstack/react-router";
import { Button, LinkTo, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { CategoryListCls } from "~/app/category/ui/CategoryListCls";

export namespace CategoryList {
	export interface Props extends CategoryListCls.Props {
		list: CategorySchema.Type[];
		categoryGroupId: string;
	}
}

export const CategoryList: FC<CategoryList.Props> = ({
	cls = CategoryListCls,
	tweak,
	list,
	categoryGroupId,
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const slots = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			{list.map((item) => (
				<LinkTo
					key={item.id}
					to={
						"/$locale/n/create/category-group/$categoryGroupId/category/$categoryId"
					}
					params={{
						locale,
						categoryGroupId,
						categoryId: item.id,
					}}
					tweak={({ what }) => ({
						slot: what.slot({
							root: what.css([
								"w-full",
							]),
						}),
					})}
				>
					<Button
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
						<Tx label={`Category ${item.name}`} />
					</Button>
				</LinkTo>
			))}
		</div>
	);
};
