import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";

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
	export interface Visible {
		threshold?: number;
	}

	export interface Proximity {
		overscan?: number;
		setTop?(proximity: boolean): void;
		setBottom?(proximity: boolean): void;
	}

	export interface Props {
		/**
		 * Primary scrolling container - only direct children are monitored by MutationObserver.
		 */
		scrollerRef: RefObject<HTMLElement | null>;
		/**
		 * Enable tracking of visible element (in scrollerRef)
		 */
		visible?: Visible;
		/**
		 * Delay in ms before setting visible state; prevent flooding state changes.
		 */
		delayMs?: number;
		/**
		 * Only specific attribute will be tracked (registered) for visibility.
		 *
		 * @default "data-visible-item"
		 */
		attribute?: string;
	}

	export interface State {
		visible: boolean;
		isVisible: boolean;
		top: boolean;
		bottom: boolean;
	}

	export interface Result {
		byIdRef: RefObject<Map<string, useElementVisibility.State>>;
	}
}

export function useElementVisibility({
	scrollerRef,
	visible,
	// proximity,
	delayMs,
	attribute = "data-visible-item",
}: useElementVisibility.Props): useElementVisibility.Result {
	const byIdRef = useRef(new Map<string, useElementVisibility.State>());

	const visibleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const topTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const bottomTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		return () => {
			clearTimer(visibleTimerRef);
			clearTimer(topTimerRef);
			clearTimer(bottomTimerRef);
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Ssst
	useLayoutEffect(() => {
		if (!scrollerRef.current) {
			console.warn("scrollerRef.current is not set");
			return;
		}

		console.log("Starting useElementVisibility", scrollerRef.current);

		/**
		 * Setup core visibility observer: this one provides "visibility" flag.
		 */
		const visibleIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = entry.target.getAttribute(attribute);
					if (!id) {
						continue;
					}

					const visible = entry.isIntersecting;

					byIdRef.current.set(id, {
						bottom: false,
						top: false,
						isVisible: visible,
						visible: visible,
					});
				}
			},
			{
				root: scrollerRef.current,
				threshold: visible?.threshold ?? 0,
				rootMargin: "0px",
			},
		);

		/**
		 * Handles dynamic updates to scroller container.
		 */
		const mo = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type !== "childList") {
					continue;
				}

				for (const node of mutation.addedNodes) {
					if (node instanceof Element && node.hasAttribute(attribute)) {
						visibleIo.observe(node);
					}
				}

				for (const node of mutation.removedNodes) {
					if (node instanceof Element && node.hasAttribute(attribute)) {
						visibleIo.unobserve(node);
					}
				}
			}
		});

		mo.observe(scrollerRef.current, {
			childList: true,
			subtree: false,
		});

		/**
		 * Default list of nodes already available in the container.
		 */
		for (const node of Array.from(scrollerRef.current.children)) {
			if (!node.hasAttribute(attribute)) {
				continue;
			}

			visibleIo.observe(node);
		}

		return () => {
			byIdRef.current.clear();
			//
			mo.disconnect();
			visibleIo.disconnect();
		};
	}, []);

	return {
		byIdRef,
	};
}
