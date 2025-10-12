import { Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import { LogoCls } from "./LogoCls";

export namespace Logo {
	export interface Props extends LogoCls.Props {}
}

export const Logo: FC<Logo.Props> = ({ cls = LogoCls, tweak, ...props }) => {
	const { slots } = useCls(cls, tweak);

	return (
		<div
			className={slots.root()}
			{...props}
		>
			<div className={slots.logo()}>zbav-se.me</div>

			<div className={slots.text()}>
				<Tx
					label="Prostě to pošli dál..."
					tone="link"
				/>
			</div>
		</div>
	);
};
