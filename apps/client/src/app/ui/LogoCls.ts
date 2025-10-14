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
				"relative",
				"transform-[rotateZ(-3deg)]",
			],
			token: [
				"tone.primary.light.text",
			],
		},
		text: {
			class: [
                "text-xl",
				"font-bold",
				"relative",
				"transform-[rotateZ(-4deg)]",
				"translate-y-[-25%]",
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
