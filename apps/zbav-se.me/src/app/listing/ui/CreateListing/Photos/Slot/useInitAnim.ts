import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace useInitAnim {
	export interface Props {
		trashRef: RefObject<HTMLDivElement | null>;
		sheetRef: RefObject<HTMLDivElement | null>;
		spinnerRef: RefObject<HTMLDivElement | null>;
		img: File | undefined;
		sheetOpacity: number;
	}
}

export const useInitAnim = ({
	trashRef,
	sheetRef,
	spinnerRef,
	img,
	sheetOpacity,
}: useInitAnim.Props) => {
	useAnim(
		() => {
			anim.set(
				trashRef.current,
				img
					? {
							autoAlpha: 1,
							scale: 1,
						}
					: {
							autoAlpha: 0,
							scale: 0.75,
						},
			);

			anim.set(sheetRef.current, {
				opacity: sheetOpacity,
			});

			anim.set(spinnerRef.current, {
				autoAlpha: 0,
			});
		},
		{
			dependencies: [],
		},
	);
};
