import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const SnapperNavCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"items",
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
					"absolute",
					"right-2",
					"top-1/2",
					"-translate-y-1/2",
					"z-20",
					"pointer-events-none",
				]),
				items: what.css([
					"flex",
					"flex-col",
					"gap-4",
					"opacity-50",
				]),
			}),
			def.rule(
				what.variant({
					orientation: "vertical",
				}),
				{
					root: what.css([]),
				},
			),
			def.rule(
				what.variant({
					orientation: "horizontal",
				}),
				{
					root: what.css([]),
				},
			),
		],
		defaults: def.defaults({
			orientation: "vertical",
		}),
	}),
);

export type SnapperNavCls = typeof SnapperNavCls;

export namespace SnapperNavCls {
	export type Props<P = unknown> = Cls.Props<SnapperNavCls, P>;
}
