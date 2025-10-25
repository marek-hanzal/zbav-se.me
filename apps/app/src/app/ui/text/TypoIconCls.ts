import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const TypoIconCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"content",
	])
	.def()
	.root({
		root: {
			class: [
				"TypoIcon-root",
				"flex",
				"flex-row",
				"gap-2",
				"items-center",
				"justify-center",
			],
		},
		content: {
			class: [
				"flex",
				"flex-col",
				"items-start",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type TypoIconCls = typeof TypoIconCls;

export namespace TypoIconCls {
	export type Props<P = unknown> = Cls.Props<TypoIconCls, P>;
}
