import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const SnapperContentCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"content",
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
					"min-h-0",
					"min-w-0",
					"scroll-smooth",
					"overscroll-contain",
					"[-webkit-overflow-scrolling:touch]",
					"snap-mandatory",
					"h-full",
				]),
				content: what.css([
					"grid",
					"min-h-full",
					"min-w-full",
				]),
			}),
			def.rule(
				what.variant({
					orientation: "vertical",
				}),
				{
					root: what.css([
						"overflow-y-auto",
						"snap-y",
					]),
					content: what.css([
						"grid-flow-row",
						"auto-rows-[100%]",
					]),
				},
			),
			def.rule(
				what.variant({
					orientation: "horizontal",
				}),
				{
					root: what.css([
						"overflow-x-auto",
						"snap-x",
					]),
					content: what.css([
						"grid-flow-col",
						"auto-cols-[100%]",
					]),
				},
			),
		],
		defaults: def.defaults({
			orientation: "vertical",
		}),
	}),
);

export type SnapperContentCls = typeof SnapperContentCls;

export namespace SnapperContentCls {
	export type Props<P = unknown> = Cls.Props<SnapperContentCls, P>;
}
