import type { FC } from "react";
import type { Style } from "~/lib/Style";
import { tva } from "~/theme/tva";

export const tvaDivider = tva({
	slots: {
		base: ["bg-orange-600"],
	},
	variants: {
		orientation: {
			horizontal: "h-0.5",
			vertical: "w-0.5",
		},
		withOpacity: {
			true: "opacity-25",
		},
	},
	defaultVariants: {
		orientation: "horizontal",
		withOpacity: true,
	},
});

export namespace Divider {
	export interface Props extends Style<typeof tvaDivider> {}
}

export const Divider: FC<Divider.Props> = ({ variant, tva = tvaDivider, css }) => {
	const tv = tva(variant);
	return <div className={tv.base({ class: css?.base })}></div>;
};
