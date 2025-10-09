import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const PriceCls = contract(ThemeCls.contract)
	.slot("root")
	.def()
	.root({
		root: {
			class: [
				"inline-flex",
				"justify-between",
				"items-center",
				"gap-6",
				"p-2",
				"pl-4",
				"w-full",
			],
			token: [
				"shadow.default",
				"round.full",
				"border.default",
				"tone.primary.dark.bg",
				"tone.primary.dark.border",
				"tone.primary.dark.text",
				"tone.primary.dark.shadow",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type PriceCls = typeof PriceCls;

export namespace PriceCls {
	export type Props<P = unknown> = Cls.Props<PriceCls, P>;
}
