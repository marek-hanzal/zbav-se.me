import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const CategoryListCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"item",
		],

		variant: {},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.both([], []),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type CategoryListCls = typeof CategoryListCls;

export namespace CategoryListCls {
	export type Props<P = unknown> = Cls.Props<CategoryListCls, P>;
}
