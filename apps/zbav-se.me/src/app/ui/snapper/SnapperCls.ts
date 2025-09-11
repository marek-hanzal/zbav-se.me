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
					"h-full",
					"overflow-auto",
					"overscroll-contain",
					"z-0",
					"scroll-smooth",
					"[-webkit-overflow-scrolling:touch]",
					"snap-y",
					"snap-mandatory",
					"grid",
					"grid-flow-row",
					"auto-rows-[minmax(100%,1fr)]",
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
