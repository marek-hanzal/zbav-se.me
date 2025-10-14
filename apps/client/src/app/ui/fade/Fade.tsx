import { Fade as CoolFade } from "@use-pico/client";
import type { FC } from "react";

export namespace Fade {
	export interface Props extends CoolFade.Props {}
}

export const Fade: FC<Fade.Props> = (props) => {
	return (
		<CoolFade
			tweak={{
				slot: {
					top: {
						class: [
							"blur-2xl",
						],
					},
					bottom: {
						class: [
							"blur-2xl",
						],
					},
				},
				token: {
					"fade.to": {
						class: [
							"from-pink-600/50",
						],
					},
					"fade.from": {
						class: [
							"to-pink-900",
						],
					},
				},
			}}
			{...props}
		/>
	);
};
