import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const SnapperCls = ThemeCls.extend(
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
					"relative",
					"min-h-0",
					"min-w-0",
					"w-full",
					"h-full",
				]),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type SnapperCls = typeof SnapperCls;
export namespace SnapperCls {
	export type Props<P = unknown> = Cls.Props<SnapperCls, P>;
}
