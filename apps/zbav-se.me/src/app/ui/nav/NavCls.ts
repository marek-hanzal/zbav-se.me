import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const NavCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
		],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.css([
					"grid",
					"grid-cols-4",
					"gap-2",
					"items-center",
					"justify-items-center",
				]),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type NavCls = typeof NavCls;

export namespace NavCls {
	export type Props<P = unknown> = Cls.Props<NavCls, P>;
}
