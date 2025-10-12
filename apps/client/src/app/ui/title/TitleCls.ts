import { type Cls, contract } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const TitleCls = contract(ThemeCls.contract)
	.slots([
		"root",
	])
	.variant("tone", [
		"primary",
		"secondary",
		"danger",
		"warning",
		"subtle",
		"neutral",
		"link",
	])
	.variant("theme", [
		"light",
		"dark",
	])
	.variant("size", [
		"xs",
		"sm",
		"md",
		"lg",
		"xl",
	])
	.def()
	.root({
		root: {
			class: [
				"flex",
				"flex-row",
				"items-center",
				"w-full",
				"gap-2",
			],
		},
	})
	.match("size", "xs", {
		root: {
			class: [
				"px-2",
				"py-1",
			],
		},
	})
	.match("size", "sm", {
		root: {
			class: [
				"px-3",
				"py-1.5",
			],
		},
	})
	.match("size", "md", {
		root: {
			class: [
				"px-4",
				"py-2",
			],
		},
	})
	.match("size", "lg", {
		root: {
			class: [
				"px-6",
				"py-3",
			],
		},
	})
	.match("size", "xl", {
		root: {
			class: [
				"px-8",
				"py-4",
			],
		},
	})
	.rule(
		{
			tone: "primary",
			theme: "dark",
		},
		{
			root: {
				token: [
					"tone.primary.dark.set",
				],
			},
		},
	)
	.rule(
		{
			tone: "primary",
			theme: "light",
		},
		{
			root: {
				token: [
					"tone.primary.light.set",
				],
			},
		},
	)
	.rule(
		{
			tone: "secondary",
			theme: "dark",
		},
		{
			root: {
				token: [
					"tone.secondary.dark.set",
				],
			},
		},
	)
	.rule(
		{
			tone: "secondary",
			theme: "light",
		},
		{
			root: {
				token: [
					"tone.secondary.light.set",
				],
			},
		},
	)
	.rule(
		{
			tone: "danger",
			theme: "dark",
		},
		{
			root: {
				class: [
					"border-red-500/60",
					"bg-red-900/90",
					"text-red-100",
				],
			},
		},
	)
	.rule(
		{
			tone: "danger",
			theme: "light",
		},
		{
			root: {
				class: [
					"border-red-200/60",
					"bg-red-100",
					"text-red-700",
				],
			},
		},
	)
	.rule(
		{
			tone: "warning",
			theme: "dark",
		},
		{
			root: {
				class: [
					"border-yellow-500/60",
					"bg-yellow-900/90",
					"text-yellow-100",
				],
			},
		},
	)
	.rule(
		{
			tone: "warning",
			theme: "light",
		},
		{
			root: {
				class: [
					"border-yellow-200/60",
					"bg-yellow-100",
					"text-yellow-700",
				],
			},
		},
	)
	.rule(
		{
			tone: "subtle",
			theme: "dark",
		},
		{
			root: {
				class: [
					"border-gray-500/60",
					"bg-gray-900/90",
					"text-gray-100",
				],
			},
		},
	)
	.rule(
		{
			tone: "subtle",
			theme: "light",
		},
		{
			root: {
				class: [
					"border-gray-200/60",
					"bg-gray-100",
					"text-gray-700",
				],
			},
		},
	)
	.rule(
		{
			tone: "neutral",
			theme: "dark",
		},
		{
			root: {
				class: [
					"border-gray-500/60",
					"bg-gray-900/90",
					"text-gray-100",
				],
			},
		},
	)
	.rule(
		{
			tone: "neutral",
			theme: "light",
		},
		{
			root: {
				class: [
					"border-gray-200/60",
					"bg-gray-100",
					"text-gray-700",
				],
			},
		},
	)
	.rule(
		{
			tone: "link",
			theme: "dark",
		},
		{
			root: {
				class: [
					"border-blue-500/60",
					"bg-blue-900/90",
					"text-blue-100",
				],
			},
		},
	)
	.rule(
		{
			tone: "link",
			theme: "light",
		},
		{
			root: {
				class: [
					"border-blue-200/60",
					"bg-blue-100",
					"text-blue-700",
				],
			},
		},
	)
	.defaults({
		tone: "primary",
		theme: "light",
		size: "lg",
	})
	.cls();

export type TitleCls = typeof TitleCls;

export namespace TitleCls {
	export type Props<P = unknown> = Cls.Props<TitleCls, P>;
}
