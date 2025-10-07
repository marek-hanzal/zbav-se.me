import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace useInitAnim {
	export interface Props {
		selectedRef: RefObject<HTMLDivElement | null>;
		unselectedRef: RefObject<HTMLDivElement | null>;
		isSelected: boolean;
		offset: string;
	}
}

export const useInitAnim = ({
	selectedRef,
	unselectedRef,
	isSelected,
	offset,
}: useInitAnim.Props) => {
	useAnim(
		() => {
			if (isSelected) {
				anim.set(selectedRef.current, {
					opacity: 1,
					x: 0,
				});
				anim.set(unselectedRef.current, {
					opacity: 0,
					x: offset,
				});
			}
			if (!isSelected) {
				anim.set(selectedRef.current, {
					opacity: 1,
					x: offset,
				});
				anim.set(unselectedRef.current, {
					opacity: 1,
					x: 0,
				});
			}
		},
		{
			dependencies: [],
		},
	);
};
