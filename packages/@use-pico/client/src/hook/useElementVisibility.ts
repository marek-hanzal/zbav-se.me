import { type RefObject, useEffect, useRef, useState } from "react";

export namespace useElementVisibility {
	export interface Visibility {
		setVisible?(visible: boolean): void;
	}

	export interface Proximity {
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
		/**
		 * Optional delay in milliseconds before the visibility state update is
		 * applied. Callbacks are called instantly, but state updates are delayed.
		 * When undefined or 0, state updates are instant.
		 */
		delayMs?: number;
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
	delayMs,
}: useElementVisibility.Props): useElementVisibility.Result {
	const [ready, setReady] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isTop, setIsTop] = useState(false);
	const [isBottom, setIsBottom] = useState(false);

	// Timer refs for delayed state updates
	const visibleTimerRef = useRef<NodeJS.Timeout>(undefined);
	const topTimerRef = useRef<NodeJS.Timeout>(undefined);
	const bottomTimerRef = useRef<NodeJS.Timeout>(undefined);

	useEffect(() => {
		if (!scrollerRef.current || !triggerRef.current) {
			return;
		}
		setReady(true);
	}, [
		scrollerRef,
		triggerRef,
	]);

	// Cleanup timers on unmount
	useEffect(() => {
		return () => {
			clearTimeout(visibleTimerRef.current);
			clearTimeout(topTimerRef.current);
			clearTimeout(bottomTimerRef.current);
		};
	}, []);

	const delay = (
		value: boolean,
		setter: (value: boolean) => void,
		timerRef: RefObject<NodeJS.Timeout | undefined>,
	) => {
		clearTimeout(timerRef.current);
		if (delayMs === undefined || delayMs === 0) {
			setter(value);
			return;
		}

		timerRef.current = setTimeout(() => {
			setter(value);
			timerRef.current = undefined;
		}, delayMs);
	};

	return {
		visible: isVisible,
		isVisible: isVisible || isTop || isBottom,
		top: isTop,
		bottom: isBottom,
	};
}
