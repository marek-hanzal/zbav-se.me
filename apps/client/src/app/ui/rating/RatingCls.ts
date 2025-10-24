import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const RatingCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"item",
	])
	.def()
	.root({
		root: {
			class: [
				"Rating-root",
				"flex",
				"flex-col",
				"items-start",
				"gap-2",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type RatingCls = typeof RatingCls;

export namespace RatingCls {
	export type Props<P = unknown> = Cls.Props<RatingCls, P>;
}
