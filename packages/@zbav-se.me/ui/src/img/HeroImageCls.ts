import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "../cls/ThemeCls";

export const HeroImageCls = contract(ThemeCls.contract)
	.slots([
		"img",
	])
	.bool("round")
	.def()
	.root({
		img: {
			class: [
				"w-full",
				"h-full",
				"object-cover",
			],
		},
	})
	.match("round", true, {
		img: {
			token: [
				"round.default",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
		round: false,
	})
	.cls();

export type HeroImageCls = typeof HeroImageCls;

export namespace HeroImageCls {
	export type Props<P = unknown> = Cls.Props<HeroImageCls, P>;
}
