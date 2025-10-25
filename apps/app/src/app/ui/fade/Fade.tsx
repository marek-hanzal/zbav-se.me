import { Fade as CoolFade } from "@use-pico/client";
import type { FC } from "react";

export namespace Fade {
	export interface Props extends CoolFade.Props {}
}

export const Fade: FC<Fade.Props> = (props) => {
	return (
		<CoolFade
			height={16}
			tweak={{
				token: {
					"fade.to": {
						class: [
							"from-pink-900",
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
