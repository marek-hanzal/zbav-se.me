import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const LayoutCls = ThemeCls.extend(
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
				root: what.both(
					[
						"h-full",
						"grid",
						"grid-rows-[min-content_minmax(0,1fr)_min-content]",
						"gap-1",
					],
					[
						"round.xl",
						"shadow.default",
						"square.sm",
						"border.default",
						"shadow.default",
						"tone.subtle.light.bg",
						"tone.subtle.light.border",
						"tone.subtle.light.shadow",
					],
				),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type LayoutCls = typeof LayoutCls;

export namespace LayoutCls {
	export type Props<P = unknown> = Cls.Props<LayoutCls, P>;
}
