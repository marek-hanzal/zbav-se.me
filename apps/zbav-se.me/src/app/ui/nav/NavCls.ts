import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const NavCls = contract(ThemeCls.contract)
	.slots([
		"root",
	])
	.def()
	.root({
		root: {
			class: [
				"grid",
				"grid-cols-4",
				"gap-2",
				"items-center",
				"justify-items-center",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type NavCls = typeof NavCls;

export namespace NavCls {
	export type Props<P = unknown> = Cls.Props<NavCls, P>;
}
