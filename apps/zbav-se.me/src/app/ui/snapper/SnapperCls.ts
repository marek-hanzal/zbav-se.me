import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const SnapperCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
		],
		variant: {
			orientation: [
				"vertical",
				"horizontal",
			],
		},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.css([
					"relative",
					"isolate",
					"min-h-0",
					"h-full",
					"overflow-hidden",
				]),
			}),
		],
		defaults: def.defaults({
			orientation: "vertical",
		}),
	}),
);

export type SnapperCls = typeof SnapperCls;
export namespace SnapperCls {
	export type Props<P = unknown> = Cls.Props<SnapperCls, P>;
}
