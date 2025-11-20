import { Fade as CoolFade } from "@use-pico/client/ui/fade";
import type { FC } from "react";

export namespace Fade {
	export interface Props extends CoolFade.Props {}
}

export const Fade: FC<Fade.Props> = ({ tweak, ...props }) => {
	return (
		<CoolFade
			height={128}
			tweak={[
				tweak,
				{
					// token: {
					// 	"fade.to": {
					// 		class: [
					// 			"from-black",
					// 		],
					// 	},
					// 	"fade.from": {
					// 		class: [
					// 			"to-white",
					// 		],
					// 	},
					// },
					variant: {
						theme: "light",
					},
				},
			]}
			{...props}
		/>
	);
};
