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
			const tl = anim.timeline();

			const onComplete = () => {
				tl.set(
					[
						selectedRef.current,
						unselectedRef.current,
					],
					{
						pointerEvents: "auto",
					},
				);
			};

			if (isSelected) {
				tl.to(
					unselectedRef.current,
					{
						opacity: 0,
						x: `-${offset}`,
						scale: scale,
						pointerEvents: "none",
						onComplete,
					},
					0,
				).to(
					selectedRef.current,
					{
						opacity: 1,
						x: 0,
						scale: 1,
						pointerEvents: "none",
						onComplete,
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
						onComplete,
					},
					0,
				);
				tl.to(
					unselectedRef.current,
					{
						opacity: 1,
						x: 0,
						scale: 1,
						onComplete,
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
