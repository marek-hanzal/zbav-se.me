import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const TitleCls = ThemeCls.extend(
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
						"flex-row",
                        'items-center',
						"w-full",
						"gap-2",
					],
					[
						"square.lg",
						"round.full",
						"border.default",
						"tone.secondary.light.border",
						"tone.secondary.light.bg",
						"tone.secondary.light.text",
					],
				),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type TitleCls = typeof TitleCls;

export namespace TitleCls {
	export type Props<P = unknown> = Cls.Props<TitleCls, P>;
}
