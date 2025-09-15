import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const TitleCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
		],
		variant: {
			tone: [
				"primary",
				"secondary",
				"danger",
				"warning",
				"subtle",
				"neutral",
				"link",
			],
			theme: [
				"light",
				"dark",
			],
			size: [
				"xs",
				"sm",
				"md",
				"lg",
				"xl",
			],
		},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.both(
					[
						"flex",
						"flex-row",
						"items-center",
						"w-full",
						"gap-2",
					],
					[
						"round.full",
						"border.default",
					],
				),
			}),
			/**
			 * Size variants
			 */
			def.rule(
				what.variant({
					size: "xs",
				}),
				{
					root: what.token([
						"padding.xs",
					]),
				},
			),
			def.rule(
				what.variant({
					size: "sm",
				}),
				{
					root: what.token([
						"padding.sm",
					]),
				},
			),
			def.rule(
				what.variant({
					size: "md",
				}),
				{
					root: what.token([
						"padding.md",
					]),
				},
			),
			def.rule(
				what.variant({
					size: "lg",
				}),
				{
					root: what.token([
						"padding.lg",
					]),
				},
			),
			def.rule(
				what.variant({
					size: "xl",
				}),
				{
					root: what.token([
						"padding.xl",
					]),
				},
			),
			/**
			 * Tone rules
			 */
			def.rule(
				what.variant({
					tone: "primary",
					theme: "dark",
				}),
				{
					root: what.token([
						"tone.primary.dark.border",
						"tone.primary.dark.bg",
						"tone.primary.dark.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "primary",
					theme: "light",
				}),
				{
					root: what.token([
						"tone.primary.light.border",
						"tone.primary.light.bg",
						"tone.primary.light.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "secondary",
					theme: "dark",
				}),
				{
					root: what.token([
						"tone.secondary.dark.border",
						"tone.secondary.dark.bg",
						"tone.secondary.dark.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "secondary",
					theme: "light",
				}),
				{
					root: what.token([
						"tone.secondary.light.border",
						"tone.secondary.light.bg",
						"tone.secondary.light.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "danger",
					theme: "dark",
				}),
				{
					root: what.token([
						"tone.danger.dark.border",
						"tone.danger.dark.bg",
						"tone.danger.dark.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "danger",
					theme: "light",
				}),
				{
					root: what.token([
						"tone.danger.light.border",
						"tone.danger.light.bg",
						"tone.danger.light.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "warning",
					theme: "dark",
				}),
				{
					root: what.token([
						"tone.warning.dark.border",
						"tone.warning.dark.bg",
						"tone.warning.dark.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "warning",
					theme: "light",
				}),
				{
					root: what.token([
						"tone.warning.light.border",
						"tone.warning.light.bg",
						"tone.warning.light.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "subtle",
					theme: "dark",
				}),
				{
					root: what.token([
						"tone.subtle.dark.border",
						"tone.subtle.dark.bg",
						"tone.subtle.dark.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "subtle",
					theme: "light",
				}),
				{
					root: what.token([
						"tone.subtle.light.border",
						"tone.subtle.light.bg",
						"tone.subtle.light.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "neutral",
					theme: "dark",
				}),
				{
					root: what.token([
						"tone.neutral.dark.border",
						"tone.neutral.dark.bg",
						"tone.neutral.dark.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "neutral",
					theme: "light",
				}),
				{
					root: what.token([
						"tone.neutral.light.border",
						"tone.neutral.light.bg",
						"tone.neutral.light.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "link",
					theme: "dark",
				}),
				{
					root: what.token([
						"tone.link.dark.border",
						"tone.link.dark.bg",
						"tone.link.dark.text",
					]),
				},
			),
			def.rule(
				what.variant({
					tone: "link",
					theme: "light",
				}),
				{
					root: what.token([
						"tone.link.light.border",
						"tone.link.light.bg",
						"tone.link.light.text",
					]),
				},
			),
		],
		defaults: def.defaults({
			tone: "primary",
			theme: "light",
			size: "lg",
		}),
	}),
);

export type TitleCls = typeof TitleCls;

export namespace TitleCls {
	export type Props<P = unknown> = Cls.Props<TitleCls, P>;
}
