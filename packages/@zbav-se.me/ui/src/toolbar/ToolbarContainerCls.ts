import { ContainerCls } from "@use-pico/client/ui/container";
import { type Cls, contract } from "@use-pico/cls";

export const ToolbarContainerCls = contract(ContainerCls.contract)
	.bool("horizontal")
	.bool("flip")
	.def()
	.match("horizontal", true, {
		root: {
			class: [
				"flex-row",
			],
		},
	})
	.match("flip", true, {
		root: {
			class: [
				"flex-row-reverse",
			],
		},
	})
	.defaults({
		horizontal: false,
		flip: false,
		//
		tone: "unset",
		theme: "unset",
		height: "fit",
		width: "fit",
		layout: "unset",
		scroll: "unset",
		snap: "unset",
		lock: "unset",
		square: "unset",
		gap: "unset",
		items: "unset",
		"place-items": "unset",
		justify: "unset",
		position: "unset",
		"snap-to": "unset",
		border: "unset",
		round: "unset",
		shadow: "unset",
		disabled: false,
	})
	.cls();

export type ToolbarContainerCls = typeof ToolbarContainerCls;

export namespace ToolbarContainerCls {
	export type Props<P = unknown> = Cls.Props<ToolbarContainerCls, P>;
}
