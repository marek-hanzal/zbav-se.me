import ScrollTrigger from "gsap/ScrollTrigger";
import { type RefObject, useEffect, useState } from "react";
import { useAnim } from "../gsap/gsap";

export namespace useElementVisibility {
	export interface Visibility extends ScrollTrigger.StaticVars {
		setVisible(visible: boolean): void;
	}

	export interface Proximity extends ScrollTrigger.StaticVars {
		overscan?: number;
		setTop?(proximity: boolean): void;
		setBottom?(proximity: boolean): void;
	}

	/**
	 * Configuration object for `useElementVisibility`.
	 */
	export interface Props {
		/**
		 * Element that ScrollTrigger observes for scroll position context.
		 */
		scrollerRef: RefObject<HTMLElement | null>;
		/**
		 * Element whose visibility within the scroller bounds is tracked.
		 */
		triggerRef: RefObject<HTMLElement | null>;
		visibility?: Visibility;
		proximity?: Proximity;
	}

	export interface Result {
		/**
		 * Pure visibility of the tracked element.
		 */
		visible: boolean;
		/**
		 * In proximity visibility (top/center/bottom)
		 */
		isVisible: boolean;
		/**
		 * Top proximity visibility.
		 */
		top: boolean;
		/**
		 * Bottom proximity visibility.
		 */
		bottom: boolean;
	}
}

/**
 * Establishes a ScrollTrigger instance that toggles visibility state while a trigger element
 * enters or leaves the viewport of the provided scroller.
 *
 * @param props - Hook configuration.
 */
export function useElementVisibility({
	scrollerRef,
	triggerRef,
	visibility,
	proximity,
}: useElementVisibility.Props): useElementVisibility.Result {
	const [ready, setReady] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isTop, setIsTop] = useState(false);
	const [isBottom, setIsBottom] = useState(false);

	useEffect(() => {
		if (!scrollerRef.current || !triggerRef.current) {
			return;
		}
		setReady(true);
	}, [
		scrollerRef,
		triggerRef,
	]);

	useAnim(
		() => {
			if (!scrollerRef.current || !triggerRef.current) {
				return;
			}

			if (visibility) {
				ScrollTrigger.create({
					trigger: triggerRef.current,
					scroller: scrollerRef.current,
					start: "top bottom",
					end: "bottom top",
					...visibility,
					onEnter(props) {
						setIsVisible(true);
						visibility?.setVisible(true);
						visibility?.onEnter?.(props);
					},
					onEnterBack(props) {
						setIsVisible(true);
						visibility?.setVisible(true);
						visibility?.onEnterBack?.(props);
					},
					onLeave(props) {
						setIsVisible(false);
						visibility?.setVisible(false);
						visibility?.onLeave?.(props);
					},
					onLeaveBack(props) {
						setIsVisible(false);
						visibility?.setVisible(false);
						visibility?.onLeaveBack?.(props);
					},
				});
			}

			if (proximity) {
				const { overscan = 2, ...proximityProps } = proximity;

				/**
				 * Top proximity trigger
				 */
				ScrollTrigger.create({
					trigger: triggerRef.current,
					scroller: scrollerRef.current,
					start: "top+=100% bottom",
					end: `bottom+=${overscan * 100}% top`,
					...proximityProps,
					onEnter(props) {
						setIsTop(true);
						proximity?.setTop?.(true);
						proximity?.onEnter?.(props);
					},
					onEnterBack(props) {
						setIsTop(true);
						proximity?.setTop?.(true);
						proximity?.onEnterBack?.(props);
					},
					onLeave(props) {
						setIsTop(false);
						proximity?.setTop?.(false);
						proximity?.onLeave?.(props);
					},
					onLeaveBack(props) {
						setIsTop(false);
						proximity?.setTop?.(false);
						proximity?.onLeaveBack?.(props);
					},
				});

				/**
				 * Bottom proximity trigger
				 */
				ScrollTrigger.create({
					trigger: triggerRef.current,
					scroller: scrollerRef.current,
					start: `top-=${overscan * 100}% bottom`,
					end: "bottom-=100% top",
					...proximityProps,
					onEnter(props) {
						setIsBottom(true);
						proximity?.setBottom?.(true);
						proximity?.onEnter?.(props);
					},
					onEnterBack(props) {
						setIsBottom(true);
						proximity?.setBottom?.(true);
						proximity?.onEnterBack?.(props);
					},
					onLeave(props) {
						setIsBottom(false);
						proximity?.setBottom?.(false);
						proximity?.onLeave?.(props);
					},
					onLeaveBack(props) {
						setIsBottom(false);
						proximity?.setBottom?.(false);
						proximity?.onLeaveBack?.(props);
					},
				});
			}
		},
		{
			scope: scrollerRef.current ?? undefined,
			dependencies: [
				ready,
			],
		},
	);

	return {
		visible: isVisible,
		isVisible: isVisible || isTop || isBottom,
		top: isTop,
		bottom: isBottom,
	};
}
