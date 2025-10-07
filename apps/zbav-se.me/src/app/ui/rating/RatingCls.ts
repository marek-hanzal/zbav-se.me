import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const RatingCls = contract(ThemeCls.contract)
	.slots([
		"root",
		"item",
	])
	.bool("check")
	.def()
	.root({
		root: {
			class: [
				"flex",
				"items-center",
				"gap-1",
			],
		},
	})
	.switch(
		"check",
		{
			item: {
				class: [],
			},
		},
		{
			item: {
				class: [],
			},
		},
	)
	.defaults({
		check: false,
		tone: "primary",
		theme: "light",
	})
	.cls();

export type RatingCls = typeof RatingCls;

export namespace RatingCls {
	export type Props<P = unknown> = Cls.Props<RatingCls, P>;
}
