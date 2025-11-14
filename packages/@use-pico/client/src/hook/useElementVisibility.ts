import ScrollTrigger from "gsap/ScrollTrigger";
import { type RefObject, useEffect, useState } from "react";
import { useAnim } from "../gsap/gsap";

export namespace useElementVisibility {
	/**
	 * Configuration object for `useElementVisibility`.
	 */
	export interface Props extends ScrollTrigger.StaticVars {
		/**
		 * Element that ScrollTrigger observes for scroll position context.
		 */
		scrollerRef: RefObject<HTMLElement | null>;
		/**
		 * Element whose visibility within the scroller bounds is tracked.
		 */
		triggerRef: RefObject<HTMLElement | null>;
		/**
		 * Callback invoked with the current visibility state.
		 */
		setVisible(visible: boolean): void;
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
	setVisible,
	onEnter,
	onEnterBack,
	onLeave,
	onLeaveBack,
	...props
}: useElementVisibility.Props) {
	const [ready, setReady] = useState(false);

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

			ScrollTrigger.create({
				trigger: triggerRef.current,
				scroller: scrollerRef.current,
				start: "top bottom",
				end: "bottom top",
				onEnter(props) {
					setVisible(true);
					onEnter?.(props);
				},
				onEnterBack(props) {
					setVisible(true);
					onEnterBack?.(props);
				},
				onLeave(props) {
					setVisible(false);
					onLeave?.(props);
				},
				onLeaveBack(props) {
					setVisible(false);
					onLeaveBack?.(props);
				},
				...props,
			});
		},
		{
			scope: scrollerRef.current ?? undefined,
			dependencies: [
				ready,
			],
		},
	);
}
