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
					"z-20",
					"pointer-events-none",
				]),
				items: what.css([
					"gap-4",
					"opacity-50",
				]),
			}),
			def.rule(
				what.variant({
					orientation: "vertical",
				}),
				{
					root: what.css([
						"right-2",
						"top-1/2",
						"-translate-y-1/2",
					]),
					items: what.css([
						"flex",
						"flex-col",
					]),
				},
			),
			def.rule(
				what.variant({
					orientation: "horizontal",
				}),
				{
					root: what.css([
						"bottom-2",
						"left-1/2",
						"-translate-x-1/2",
					]),
					items: what.css([
						"flex",
						"flex-row",
					]),
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
