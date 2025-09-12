import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const TourCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"nav",
		],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.both(
					[
						"min-w-[215px]",
						"max-w-[285px]",
					],
					[
						"square.md",
						"shadow.default",
						"round.lg",
						"border.default",
						"tone.secondary.light.bg",
						"tone.secondary.light.text",
						"tone.secondary.light.border",
						"tone.secondary.light.shadow",
					],
				),
				nav: what.css([
					"inline-flex",
					"flex-row",
					"gap-2",
				]),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type TourCls = typeof TourCls;

export namespace TourCls {
	export type Props<P = unknown> = Cls.Props<TourCls, P>;
}
