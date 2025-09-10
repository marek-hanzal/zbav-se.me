import { useParams } from "@tanstack/react-router";
import { Button, LinkTo, Tx } from "@use-pico/client";
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
	const { locale } = useParams({
		from: "/$locale",
	});
	const slots = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			{list.map((item) => (
				<LinkTo
					key={item.id}
					to={"/$locale/n/create/$categoryGroupId"}
					params={{
						locale,
						categoryGroupId: item.id,
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
						tone={"subtle"}
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
				</LinkTo>
			))}
		</div>
	);
};
