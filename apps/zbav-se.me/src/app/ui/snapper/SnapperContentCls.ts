import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const SnapperContentCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"viewport",
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
				viewport: what.css([
					"h-full",
					"overflow-auto",
					"overscroll-contain",
					"z-0",
					"scroll-smooth",
					"[-webkit-overflow-scrolling:touch]",
					"snap-mandatory",
				]),
				content: what.css([
					"h-full",
					"min-h-full",
					"items-stretch",
					"gap-0",
				]),
			}),
			def.rule(
				what.variant({
					orientation: "vertical",
				}),
				{
					viewport: what.css([
						"snap-y",
						"touch-pan-x",
					]),
					content: what.css([
						"flex",
						"flex-col",
						//     "grid",
						// "grid-flow-row",
						// "auto-rows-[100%]",
					]),
				},
			),
			def.rule(
				what.variant({
					orientation: "horizontal",
				}),
				{
					viewport: what.css([
						"snap-x",
						"touch-pan-y",
					]),
					content: what.css([
						"inline-flex",
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
