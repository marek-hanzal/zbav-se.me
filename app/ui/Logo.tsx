import type { FC } from "react";
import type { Style } from "~/lib/Style";
import { tva } from "~/theme/tva";

export const LogoTva = tva({
	slots: {
		base: ["px-4", "py-2", "flex", "items-center"],
		text: ["text-orange-700", "text-4xl"],
		suffix: ["text-orange-600", "text-xl"],
	},
});

export namespace Logo {
	export interface Props extends Style<typeof LogoTva> {}
}

export const Logo: FC<Logo.Props> = ({ variant, tva = LogoTva, css }) => {
	const tv = tva(variant);
	return (
		<div className={tv.base({ class: css?.base })}>
			<span className={tv.text({ class: css?.text })}>zbav-se</span>
			<span className={tv.suffix({ class: css?.suffix })}>.me</span>
		</div>
	);
};
