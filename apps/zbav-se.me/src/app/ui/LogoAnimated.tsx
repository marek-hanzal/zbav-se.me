import { Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import { LogoCls } from "~/app/ui/LogoCls";

export namespace LogoAnimated {
	export interface Props extends LogoCls.Props {
		/** Whether to enable the looped animation after initial enter animation */
		loop?: boolean;
	}
}

export const LogoAnimated: FC<LogoAnimated.Props> = ({
	cls = LogoCls,
	tweak,
	loop = true,
	...props
}) => {
	const { slots } = useCls(cls, tweak);

	return (
		<div
			className={slots.root()}
			{...props}
		>
			<div className={slots.logo()}>zbav-se.me</div>

			<div className={slots.text()}>
				<Tx label="Prostě to pošli dál..." />
			</div>
		</div>
	);
};
