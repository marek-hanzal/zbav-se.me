import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace useOpacityAnim {
	export interface Props {
		sheetRef: RefObject<HTMLDivElement | null>;
		sheetOpacity: number;
	}
}

export const useOpacityAnim = ({
	sheetRef,
	sheetOpacity,
}: useOpacityAnim.Props) => {
	useAnim(
		() => {
			anim.to(sheetRef.current, {
				opacity: sheetOpacity,
			});
		},
		{
			dependencies: [
				sheetOpacity,
			],
		},
	);
};
