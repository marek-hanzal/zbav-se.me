import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const BackgroundCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"top",
		"bottom",
	])
	.def()
	.root({
		root: {
			class: [
				"Background-root",
				"pointer-events-none",
				"absolute",
				"inset-0",
				"overflow-hidden",
			],
		},
		top: {
			class: [
				"absolute",
				"-top-24",
				"right-[-10%]",
				"h-[36rem]",
				"w-[36rem]",
				"rounded-full",
				"bg-gradient-to-br",
				"from-indigo-500/20",
				"to-cyan-500/10",
				"blur-2xl",
			],
		},
		bottom: {
			class: [
				"absolute",
				"-bottom-16",
				"left-[-10%]",
				"h-[28rem]",
				"w-[28rem]",
				"rounded-full",
				"bg-gradient-to-tr",
				"from-fuchsia-500/10",
				"to-purple-500/10",
				"blur-2xl",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type BackgroundCls = typeof BackgroundCls;

export namespace BackgroundCls {
	export type Props<P = unknown> = Cls.Props<BackgroundCls, P>;
}
