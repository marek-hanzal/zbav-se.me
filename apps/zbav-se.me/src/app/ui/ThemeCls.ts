import { PicoCls } from "@use-pico/client";

export const ThemeCls = PicoCls.extend(
	{
		tokens: [],
		slot: [],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({
			"round.xl": what.css([
				"rounded-4xl",
			]),
		}),
		rules: [],
		defaults: def.defaults({}),
	}),
);

export type ThemeCls = typeof ThemeCls;
