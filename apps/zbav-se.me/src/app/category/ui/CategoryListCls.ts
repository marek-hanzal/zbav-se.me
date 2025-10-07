import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const CategoryListCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"item",
	])
	.def()
	.root({
		root: {
			class: [
				"flex",
				"flex-col",
				"gap-2",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type CategoryListCls = typeof CategoryListCls;

export namespace CategoryListCls {
	export type Props<P = unknown> = Cls.Props<CategoryListCls, P>;
}
