import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

function clearTimer(ref: RefObject<ReturnType<typeof setTimeout> | undefined>) {
	if (ref.current) {
		clearTimeout(ref.current);
		ref.current = undefined;
	}
}

function applyWithDelay(
	value: boolean,
	setter: (value: boolean) => void,
	timerRef: RefObject<ReturnType<typeof setTimeout> | undefined>,
	delayMs: number | undefined,
) {
	clearTimer(timerRef);

	if (!delayMs) {
		setter(value);
		return;
	}

	timerRef.current = setTimeout(() => {
		setter(value);
		timerRef.current = undefined;
	}, delayMs);
}

export namespace useElementVisibility {
	export interface Visibility {
		setVisible?(visible: boolean): void;
	}

	export interface Proximity {
		overscan?: number;
		setTop?(proximity: boolean): void;
		setBottom?(proximity: boolean): void;
	}

	export interface Props {
		scrollerRef: RefObject<HTMLElement | null>;
		triggerRef: RefObject<HTMLElement | null>;
		visibility?: Visibility;
		proximity?: Proximity;
		delayMs?: number;
	}

	export interface Result {
		visible: boolean;
		isVisible: boolean;
		top: boolean;
		bottom: boolean;
	}
}

/**
 * Native (IntersectionObserver) replacement for the original GSAP ScrollTrigger logic.
 * Intended to behave 1:1 with the previous implementation:
 *
 * - visibility: active when trigger intersects scroller viewport (like "top bottom" -> "bottom top")
 * - proximity.top: zone derived from start "top+=100% bottom" and end `bottom+=overscan*100% top`
 * - proximity.bottom: zone derived from start `top-=overscan*100% bottom` and end "bottom-=100% top"
 */
export function useElementVisibility({
	scrollerRef,
	triggerRef,
	visibility,
	proximity,
	delayMs,
}: useElementVisibility.Props): useElementVisibility.Result {
	const [ready, setReady] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isTop, setIsTop] = useState(false);
	const [isBottom, setIsBottom] = useState(false);

	const visibleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const topTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const bottomTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		if (!scrollerRef.current || !triggerRef.current) {
			setReady(false);
			return;
		}
		setReady(true);
	}, [
		scrollerRef,
		triggerRef,
	]);

	useEffect(() => {
		return () => {
			clearTimer(visibleTimerRef);
			clearTimer(topTimerRef);
			clearTimer(bottomTimerRef);
		};
	}, []);

	useLayoutEffect(() => {
		const root = scrollerRef.current;
		const target = triggerRef.current;
		if (!ready || !root || !target) {
			return;
		}

		let visibilityObserver: IntersectionObserver | undefined;
		let topObserver: IntersectionObserver | undefined;
		let bottomObserver: IntersectionObserver | undefined;

		if (visibility) {
			console.log("Starting visibility observer");

			visibilityObserver = new IntersectionObserver(
				([entry]) => {
					visibility.setVisible?.(!!entry?.isIntersecting);
					applyWithDelay(!!entry?.isIntersecting, setIsVisible, visibleTimerRef, delayMs);
				},
				{
					root,
					threshold: 0.01,
					rootMargin: "0px",
				},
			);

			visibilityObserver.observe(target);
		}

		if (proximity) {
			const overscan = proximity.overscan ?? 2;

			topObserver = new IntersectionObserver(
				([entry]) => {
					proximity.setTop?.(!!entry?.isIntersecting);
					applyWithDelay(!!entry?.isIntersecting, setIsTop, topTimerRef, delayMs);
				},
				{
					root,
					threshold: 0,
					rootMargin: `${overscan * 100}% 0px 100% 0px`,
				},
			);
			topObserver.observe(target);

			bottomObserver = new IntersectionObserver(
				([entry]) => {
					proximity.setBottom?.(!!entry?.isIntersecting);
					applyWithDelay(!!entry?.isIntersecting, setIsBottom, bottomTimerRef, delayMs);
				},
				{
					root,
					threshold: 0,
					rootMargin: `100% 0px ${overscan * 100}% 0px`,
				},
			);
			bottomObserver.observe(target);
		}

		return () => {
			console.log("Disconnecting observers");
			visibilityObserver?.disconnect();
			topObserver?.disconnect();
			bottomObserver?.disconnect();
		};
	}, [
		ready,
		scrollerRef.current,
		triggerRef.current,
		visibility,
		proximity,
		delayMs,
	]);

	return {
		visible: isVisible,
		isVisible: isVisible || isTop || isBottom,
		top: isTop,
		bottom: isBottom,
	};
}
