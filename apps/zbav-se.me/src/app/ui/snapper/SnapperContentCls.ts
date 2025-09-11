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
					"snap-y",
					"snap-mandatory",
				]),
				content: what.css([
					"min-h-full",
					"grid",
					"grid-flow-row",
					"auto-rows-[100%]",
				]),
			}),
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
