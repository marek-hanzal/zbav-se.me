import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui/cls";

export const HeroImageCls = contract(ThemeCls.contract)
	.slots([
		"img",
	])
	.bool("round")
	.def()
	.match("round", true, {
		img: {
			class: [
				"w-full",
				"h-full",
				"object-cover",
			],
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
