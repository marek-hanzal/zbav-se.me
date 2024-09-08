import type { ButtonHTMLAttributes, FC } from "react";
import type { Style } from "~/lib/Style";
import { tva } from "~/theme/tva";

export const ButtonTva = tva({
	slots: {
		base: [
			"rounded",
			"transition",
			"focus:outline-none",
			"focus:ring",
			"focus:ring-orange-300",
			"focus:ring-opacity-50",
		],
	},
	variants: {
		variant: {
			primary: "bg-orange-300 border border-orange-500 text-orange-800",
		},
		disabled: {
			true: "opacity-50 cursor-not-allowed pointer-events-none",
		},
		size: {
			small: "text-sm px-2 py-1",
			medium: "text-base px-4 py-2",
			large: "text-lg px-5 py-3",
		},
	},
	compoundSlots: [
		{
			slots: ["base"],
			variant: "primary",
			disabled: true,
			class: ["bg-orange-400"],
		},
	],
	defaultVariants: {
		variant: "primary",
		disabled: false,
		size: "medium",
	},
});

export namespace Button {
	export interface Props extends Style<typeof ButtonTva, ButtonHTMLAttributes<HTMLButtonElement>> {}
}

export const Button: FC<Button.Props> = ({ variant, tva = ButtonTva, css, ...props }) => {
	const tv = tva(variant);
	return (
		<button
			type={"button"}
			className={tv.base({ class: css?.base })}
			{...props}
		/>
	);
};
