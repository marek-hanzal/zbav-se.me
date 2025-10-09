import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const DialCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"display",
		"number",
	])
	.bool("disabled")
	.def()
	.root({
		root: {
			class: [
				"flex",
				"flex-col",
				"items-center",
				"justify-center",
				"gap-2",
				"w-2/3",
				"mx-auto",
			],
		},
		display: {
			class: [
				"inline-flex",
				"items-center",
				"justify-between",
				"w-full",
			],
			token: [
				"padding.sm",
				"round.full",
				"border.sm",
				"shadow.default",
				"tone.primary.dark.bg",
				"tone.primary.dark.text",
				"tone.primary.dark.border",
				"tone.primary.dark.shadow",
			],
		},
		number: {
			class: [
				"flex",
				"flex-col",
				"items-center",
				"justify-center",
			],
			token: [
				"round.full",
				"border.md",
				"square.lg",
				"tone.secondary.dark.bg",
				"tone.secondary.dark.border",
			],
		},
	})
	.match("disabled", true, {
		number: {
			class: [
				"pointer-events-none",
			],
		},
	})
	.defaults({
		disabled: false,
		tone: "primary",
		theme: "light",
	})
	.cls();

export type DialCls = typeof DialCls;

export namespace DialCls {
	export type Props<P = unknown> = Cls.Props<DialCls, P>;

	export type Slots = Cls.SlotsOf<DialCls>;
}
