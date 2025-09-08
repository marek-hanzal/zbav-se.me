import { PicoCls } from "@use-pico/client";

export const ThemeCls = PicoCls.extend(
	{
		tokens: [],
		slot: [],
		variant: {},
	},
	({ def }) => ({
		token: def.token({}),
		rules: [],
		defaults: def.defaults({}),
	}),
);

export type ThemeCls = typeof ThemeCls;
