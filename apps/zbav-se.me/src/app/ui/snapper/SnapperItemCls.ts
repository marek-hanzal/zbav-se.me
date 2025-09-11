import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const SnapperItemCls = ThemeCls.extend(
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
					"snap-start",
					"min-h-0",
					"min-w-0",
					"[scroll-snap-stop:always]",
				]),
			}),
			def.rule(
				what.variant({
					orientation: "vertical",
				}),
				{
					root: what.css([
						"min-h-full",
					]),
				},
			),
			def.rule(
				what.variant({
					orientation: "horizontal",
				}),
				{
					root: what.css([
						"min-w-full",
					]),
				},
			),
		],
		defaults: def.defaults({
			orientation: "vertical",
		}),
	}),
);

export type SnapperItemCls = typeof SnapperItemCls;

export namespace SnapperItemCls {
	export type Props<P = unknown> = Cls.Props<SnapperItemCls, P>;
}
