import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const LogoCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"logo",
		"text",
	])
	.def()
	.root({
		root: {
			class: [],
		},
		logo: {
			class: [
				"font-limelight",
				"text-4xl",
				"opacity-0",
				"transform-[rotateZ(-5deg)]",
			],
			token: [
				"tone.primary.light.text",
			],
		},
		text: {
			class: [
				"text-xl",
				"font-bold",
				"opacity-0",
				"transform-[rotateZ(-2deg)]",
			],
			token: [
				"tone.link.light.text",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type LogoCls = typeof LogoCls;

export namespace LogoCls {
	export type Props<P = unknown> = Cls.Props<LogoCls, P>;
}
