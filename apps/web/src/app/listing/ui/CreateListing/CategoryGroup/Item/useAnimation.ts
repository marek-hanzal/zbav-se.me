import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace useAnimation {
	export interface Props {
		selectedRef: RefObject<HTMLDivElement | null>;
		unselectedRef: RefObject<HTMLDivElement | null>;
		isSelected: boolean;
		offset: string;
		scale: number;
	}
}

export const useAnimation = ({
	selectedRef,
	unselectedRef,
	isSelected,
	offset,
	scale,
}: useAnimation.Props) => {
	useAnim(
		() => {
			const tl = anim.timeline({
				defaults: {
					duration: 0.25,
				},
			});

			if (isSelected) {
				tl.to(
					unselectedRef.current,
					{
						opacity: 0,
						x: `-${offset}`,
						scale: scale,
						pointerEvents: "none",
					},
					0,
				).to(
					selectedRef.current,
					{
						opacity: 1,
						x: 0,
						scale: 1,
						pointerEvents: "auto",
					},
					0,
				);
			}

			if (!isSelected) {
				tl.to(
					selectedRef.current,
					{
						opacity: 0,
						x: offset,
						scale: scale,
						pointerEvents: "none",
					},
					0,
				);
				tl.to(
					unselectedRef.current,
					{
						opacity: 1,
						x: 0,
						scale: 1,
						pointerEvents: "auto",
					},
					0,
				);
			}
		},
		{
			dependencies: [
				isSelected,
			],
		},
	);
};
