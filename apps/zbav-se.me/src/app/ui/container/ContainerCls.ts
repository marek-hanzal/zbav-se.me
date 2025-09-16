import { PicoCls } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";

export const ContainerCls = PicoCls.extend(
	{
		tokens: [],
		slot: [
			"root",
		],
		variant: {
			height: [
				"full",
				"dvh",
				"auto",
				"fit",
			],
			width: [
				"full",
				"dvw",
				"auto",
				"fit",
			],
			orientation: [
				"vertical",
				"horizontal",
				"none",
			],
			item: [
				"col",
				"row",
				"none",
			],
		},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			/**
			 * Height rules
			 */
			def.rule(
				what.variant({
					height: "full",
				}),
				{
					root: what.css([
						"Container-root-height[full]",
						"h-full",
						"min-h-0",
						"max-h-full",
					]),
				},
			),
			def.rule(
				what.variant({
					height: "dvh",
				}),
				{
					root: what.css([
						"Container-root-height[dvh]",
						"h-dvh",
						"min-h-dvh",
						"w-full",
					]),
				},
			),
			def.rule(
				what.variant({
					height: "auto",
				}),
				{
					root: what.css([
						"Container-root-height[auto]",
						"h-auto",
						"min-h-0",
						"w-full",
					]),
				},
			),
			/**
			 * Width rules
			 */
			def.rule(
				what.variant({
					width: "full",
				}),
				{
					root: what.css([
						"Container-root-width[full]",
						"w-full",
						"min-w-0",
						"max-w-full",
					]),
				},
			),
			def.rule(
				what.variant({
					width: "dvw",
				}),
				{
					root: what.css([
						"Container-root-width[dvw]",
						"w-dvw",
						"min-w-dvw",
					]),
				},
			),
			def.rule(
				what.variant({
					width: "auto",
				}),
				{
					root: what.css([
						"Container-root-width[auto]",
						"w-auto",
						"min-w-0",
						"h-full",
					]),
				},
			),
			/**
			 * Orientation rules
			 */
			def.rule(
				what.variant({
					orientation: "horizontal",
				}),
				{
					root: what.css([
						"Container-root-orientation[horizontal]",
						"grid",
						"grid-flow-col",
						"auto-cols-auto",
					]),
				},
			),
			def.rule(
				what.variant({
					item: "col",
				}),
				{
					root: what.css([
						"Container-root-item[col]",
						"h-full",
						"w-auto",
						"min-w-0",
						"min-h-0",
					]),
				},
			),
			def.rule(
				what.variant({
					orientation: "vertical",
				}),
				{
					root: what.css([
						"Container-root-orientation[vertical]",
						"grid",
						"grid-flow-row",
						"auto-rows-auto",
					]),
				},
			),
			def.rule(
				what.variant({
					item: "row",
				}),
				{
					root: what.css([
						"Container-root-item[row]",
						"w-full",
						"h-auto",
						"min-h-0",
						"min-w-0",
					]),
				},
			),
		],
		defaults: def.defaults({
			height: "auto",
			width: "auto",
			orientation: "none",
			item: "none",
		}),
	}),
);

export type ContainerCls = typeof ContainerCls;

export namespace ContainerCls {
	export type Props<P = unknown> = Cls.Props<ContainerCls, P>;
}
