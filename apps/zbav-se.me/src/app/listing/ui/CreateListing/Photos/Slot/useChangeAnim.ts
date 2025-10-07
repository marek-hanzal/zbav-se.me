import type { useSetUnset } from "@use-pico/client";
import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace useChangeAnim {
	export interface Props {
		spinnerRef: RefObject<HTMLDivElement | null>;
		trashRef: RefObject<HTMLDivElement | null>;
		sheetRef: RefObject<HTMLDivElement | null>;
		sheetTransitionScale: number;
		sheetTransitionOpacity: number;
		sheetX: string;
		sheetOpacity: number;
		setImg: (img: File | undefined) => void;
		value: File | undefined;
		transition: useSetUnset.Transition;
	}
}

export const useChangeAnim = ({
	transition,
	spinnerRef,
	trashRef,
	sheetRef,
	sheetTransitionScale,
	sheetTransitionOpacity,
	sheetX,
	sheetOpacity,
	setImg,
	value,
}: useChangeAnim.Props) => {
	useAnim(
		() => {
			if (transition === "change") {
				anim.timeline()
					.to(
						spinnerRef.current,
						{
							autoAlpha: 1,
							duration: 0.2,
						},
						0,
					)
					.set(
						trashRef.current,
						{
							pointerEvents: "none",
						},
						0,
					)
					.to(
						trashRef.current,
						{
							opacity: 0.25,
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
					.addLabel("finish")
					//
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
					.to(
						trashRef.current,
						{
							opacity: 1,
						},
						"finish",
					)
					//
					//
					.to(
						spinnerRef.current,
						{
							autoAlpha: 0,
							duration: 0.2,
						},
						"finish",
					)
					.set(trashRef.current, {
						pointerEvents: "auto",
					});
			}
		},
		{
			dependencies: [
				transition,
			],
		},
	);
};
