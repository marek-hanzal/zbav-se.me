import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const SnapperNavCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"items",
		],
		variant: {
			orientation: [
				"vertical",
				"horizontal",
			],
		},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.both(
					[
						"absolute",
						"z-20",
						"pointer-events-none",
						"bg-white/80",
					],
					[
						"square.sm",
					],
				),
				items: what.css([
					"gap-4",
					// "opacity-80",
				]),
			}),
			def.rule(
				what.variant({
					orientation: "vertical",
				}),
				{
					root: what.both(
						[
							"right-0",
							"top-1/2",
							"-translate-y-1/2",
						],
						[
							"round.lg",
						],
					),
					items: what.css([
						"flex",
						"flex-col",
					]),
				},
			),
			def.rule(
				what.variant({
					orientation: "horizontal",
				}),
				{
					root: what.both(
						[
							"bottom-4",
							"left-1/2",
							"-translate-x-1/2",
						],
						[
							"round.xl",
						],
					),
					items: what.css([
						"flex",
						"flex-row",
						"gap-0",
					]),
				},
			),
		],
		defaults: def.defaults({
			orientation: "vertical",
		}),
	}),
);

export type SnapperNavCls = typeof SnapperNavCls;

export namespace SnapperNavCls {
	export type Props<P = unknown> = Cls.Props<SnapperNavCls, P>;
}
