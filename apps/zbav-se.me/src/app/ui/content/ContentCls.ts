import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const ContentCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"inner",
		],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.css([
					"grid",
					"place-items-center",
				]),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type ContentCls = typeof ContentCls;

export namespace ContentCls {
	export type Props<P = unknown> = Cls.Props<ContentCls, P>;
}
