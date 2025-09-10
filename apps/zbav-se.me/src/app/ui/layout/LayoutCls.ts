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
                        'h-full',
						"grid",
						"grid-rows-[min-content_minmax(0,1fr)_min-content]",
					],
					[
						"round.xl",
						"shadow.default",
						"square.lg",
						"border.default",
						"shadow.default",
						"tone.primary.light.bg",
						"tone.primary.light.border",
						"tone.primary.light.shadow",
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
