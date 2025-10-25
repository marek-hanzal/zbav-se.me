import type { useSetUnset } from "@use-pico/client";
import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace useSetAnim {
	export interface Props {
		transition: useSetUnset.Transition;
		spinnerRef: RefObject<HTMLDivElement | null>;
		sheetRef: RefObject<HTMLDivElement | null>;
		trashRef: RefObject<HTMLDivElement | null>;
		sheetTransitionScale: number;
		sheetTransitionOpacity: number;
		sheetX: string;
		sheetOpacity: number;
		value: File | undefined;
		setImg: (img: File | undefined) => void;
	}
}

export const useSetAnim = ({
	transition,
	spinnerRef,
	sheetRef,
	trashRef,
	sheetTransitionScale,
	sheetTransitionOpacity,
	sheetX,
	sheetOpacity,
	value,
	setImg,
}: useSetAnim.Props) => {
	useAnim(
		() => {
			if (transition === "set") {
				anim.timeline()
					.to(
						spinnerRef.current,
						{
							autoAlpha: 1,
						},
						0,
					)
					//
					//
					.to(
						sheetRef.current,
						{
							scale: sheetTransitionScale,
							opacity: sheetTransitionOpacity,
						},
						0,
					)
					//
					.to(sheetRef.current, {
						opacity: 0,
						x: `-${sheetX}`,
						onComplete() {
							setImg(value);
						},
					})
					.set(sheetRef.current, {
						x: sheetX,
					})
					//
					.to(sheetRef.current, {
						opacity: sheetTransitionOpacity,
						x: 0,
					})
					.addLabel("finish")
					.to(
						sheetRef.current,
						{
							opacity: sheetOpacity,
							scale: 1,
						},
						"finish",
					)
					.to(
						trashRef.current,
						{
							autoAlpha: 1,
							scale: 1,
						},
						"finish",
					)
					//
					//
					.to(
						spinnerRef.current,
						{
							autoAlpha: 0,
						},
						"finish",
					);
			}
		},
		{
			dependencies: [
				transition,
			],
		},
	);
};
