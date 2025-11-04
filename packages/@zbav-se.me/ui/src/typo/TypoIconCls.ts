import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "../cls/ThemeCls";

export const TypoIconCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"content",
	])
	.variant("justify", [
		"start",
		"center",
	])
	.variant("items", [
		"start",
		"center",
	])
	.def()
	.root({
		root: {
			class: [
				"TypoIcon-root",
				"flex",
				"flex-row",
				"gap-2",
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
	//
	.match("justify", "start", {
		root: {
			class: [
				"justify-start",
			],
		},
	})
	.match("justify", "center", {
		root: {
			class: [
				"justify-center",
			],
		},
	})
	//
	.match("items", "start", {
		content: {
			class: [
				"items-start",
			],
		},
	})
	.match("items", "center", {
		content: {
			class: [
				"items-center",
			],
		},
	})
	//
	.defaults({
		justify: "center",
		items: "center",
		tone: "primary",
		theme: "light",
	})
	.cls();

export type TypoIconCls = typeof TypoIconCls;

export namespace TypoIconCls {
	export type Props<P = unknown> = Cls.Props<TypoIconCls, P>;
}
