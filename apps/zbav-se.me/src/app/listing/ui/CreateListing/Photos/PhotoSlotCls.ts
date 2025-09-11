import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const PhotoSlotCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"slot",
			"img",
		],
		variant: {
			default: [
				"bool",
			],
		},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.both(
					[
						"h-full",
						"px-0",
						"pb-0",
					],
					[
						"square.md",
					],
				),
				slot: what.both(
					[
						"h-full",
						"flex",
						"items-center",
						"justify-center",
					],
					[
						"border.md",
						"round.xl",
						"tone.link.light.border",
						"tone.link.light.bg",
					],
				),
				img: what.both(
					[
						"w-full",
						"h-full",
						"object-cover",
						"object-center",
						"block",
						"select-none",
						"aspect-[4/5]",
					],
					[
						"round.xl",
					],
				),
			}),
			def.rule(
				what.variant({
					default: true,
				}),
				{
					slot: what.token([
						"tone.primary.light.border",
						"tone.primary.light.bg",
					]),
				},
			),
		],
		defaults: def.defaults({
			default: false,
		}),
	}),
);

export type PhotoSlotCls = typeof PhotoSlotCls;

export namespace PhotoSlotCls {
	export type Props<P = unknown> = Cls.Props<PhotoSlotCls, P>;
}
