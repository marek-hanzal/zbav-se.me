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
					"min-h-0",
					"overflow-auto",
					"overscroll-contain",
				]),
				inner: what.both([
					"min-h-full",
					"grid",
					"place-content-center",
                    'px-0',
				],[
                    'square.lg',
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
