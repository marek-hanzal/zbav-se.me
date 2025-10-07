import type { useSetUnset } from "@use-pico/client";
import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace useUnsetAnim {
	export interface Props {
		transition: useSetUnset.Transition;
		spinnerRef: RefObject<HTMLDivElement | null>;
		trashRef: RefObject<HTMLDivElement | null>;
		sheetRef: RefObject<HTMLDivElement | null>;
		sheetTransitionScale: number;
		sheetTransitionOpacity: number;
		sheetX: string;
		sheetOpacity: number;
		setImg: (img: File | undefined) => void;
	}
}

export const useUnsetAnim = ({
	transition,
	spinnerRef,
	trashRef,
	sheetRef,
	sheetTransitionScale,
	sheetTransitionOpacity,
	sheetX,
	sheetOpacity,
	setImg,
}: useUnsetAnim.Props) => {
	useAnim(
		() => {
			if (transition === "unset") {
				anim.timeline()
					.to(
						spinnerRef.current,
						{
							autoAlpha: 1,
							duration: 0.2,
						},
						0,
					)
					.to(
						trashRef.current,
						{
							autoAlpha: 0,
							scale: 0.75,
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
							setImg(undefined);
						},
					})
					.set(sheetRef.current, {
						x: sheetX,
					})
					//
					.addLabel("finish")
					.to(
						sheetRef.current,
						{
							opacity: sheetTransitionOpacity,
							x: 0,
						},
						"finish",
					)
					.to(
						sheetRef.current,
						{
							scale: 1,
							opacity: sheetOpacity,
						},
						"finish",
					)
					//
					.to(
						spinnerRef.current,
						{
							autoAlpha: 0,
							duration: 0.2,
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
