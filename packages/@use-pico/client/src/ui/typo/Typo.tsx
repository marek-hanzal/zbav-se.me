import type { ComponentProps, FC, ReactNode } from "react";
import { asTypo } from "./asTypo";

const presets: Record<Typo.Preset, Partial<Omit<Typo.Props, "className">>> = {
	none: {},
	label: {
		size: "lg",
		font: "bold",
	},
	header: {
		size: "3xl",
		font: "bold",
		display: "block",
	},
	subheader: {
		size: "xl",
		font: "bold",
		display: "block",
	},
	blockquote: {},
	paragraph: {},
};

export namespace Typo {
	export type Value = ReactNode;

	export type Preset = "none" | "header" | "subheader" | "label" | "paragraph" | "blockquote";

	export interface Props extends asTypo.PropsEx<ComponentProps<"span">> {
		label: Value;
		preset?: Preset;
	}

	export type PropsEx = Omit<Props, "label">;
}

export const Typo: FC<Typo.Props> = ({
	label,
	preset = "none",
	truncate,
	display,
	wrap,
	size,
	font,
	tone,
	theme,
	italic,
	//
	className,
	...props
}) => {
	return (
		<span
			{...asTypo({
				tone,
				theme,
				size,
				font,
				display,
				wrap,
				truncate,
				italic,
				//
				className,
			})}
			//
			{...presets[preset]}
			//
			{...props}
		>
			{label}
		</span>
	);
};
