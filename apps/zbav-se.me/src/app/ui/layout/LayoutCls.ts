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
						"flex",
						"flex-col",
						"min-h-full",
						"min-w-full",
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
