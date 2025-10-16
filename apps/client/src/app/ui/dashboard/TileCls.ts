import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const TileCls = contract(ThemeCls.contract)
	.slots([
		"root",
	])
	.def()
	.root({
		root: {
			class: [
				"Tile-root",
				"flex",
				"flex-col",
				"items-center",
				"justify-center",
				"h-full",
				"w-full",
			],
			token: [
				"shadow.default",
				"border.default",
				"tone.secondary.light.bg",
				"tone.secondary.light.shadow",
				"tone.secondary.light.border",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type TileCls = typeof TileCls;

export namespace TileCls {
	export type Props<P = unknown> = Cls.Props<TileCls, P>;
}
