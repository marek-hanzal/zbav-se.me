import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "../cls";

export const ChatInputCls = contract(ThemeCls.contract)
	.slots([
		"input",
	])
	.def()
	.root({
		input: {
			class: [
				"resize-none",
				"outline-none",
				"text-md",
				"leading-5",
				"placeholder:text-slate-400",
				"w-full",
				"bg-slate-100",
				"text-slate-600",
			],
			token: [
				"round.default",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type ChatInputCls = typeof ChatInputCls;

export namespace ChatInputCls {
	export type Props<P = unknown> = Cls.Props<ChatInputCls, P>;
}
