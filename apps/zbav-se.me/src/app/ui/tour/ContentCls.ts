import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const ContentCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"tooltip",
		],
		variant: {
			center: [
				"bool",
			],
		},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.css([
					"top-0",
					"left-0",
					"max-w-[100dvw]",
					"max-h-[100dvh]",
					"z-[10000]",
				]),
				tooltip: what.both(
					[
						"overflow-auto",
					],
					[
						"round.lg",
						"border.default",
						"shadow.default",
						"square.md",
						"tone.secondary.light.text",
						"tone.secondary.light.bg",
						"tone.secondary.light.border",
						"tone.secondary.light.shadow",
					],
				),
			}),
			def.rule(
				what.variant({
					center: true,
				}),
				{
					root: what.css([
						// "translate-y-1/2",
					]),
				},
			),
		],
		defaults: def.defaults({
			center: false,
		}),
	}),
);

export type ContentCls = typeof ContentCls;

export namespace ContentCls {
	export type Props<P = unknown> = Cls.Props<ContentCls, P>;
}
