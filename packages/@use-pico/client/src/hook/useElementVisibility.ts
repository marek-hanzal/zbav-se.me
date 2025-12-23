import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { createVisibilityStore } from "../store/createVisibilityStore";

function clearTimer(ref: RefObject<ReturnType<typeof setTimeout> | undefined>) {
	if (ref.current) {
		clearTimeout(ref.current);
		ref.current = undefined;
	}
}

function delay(
	apply: () => void,
	timerRef: RefObject<ReturnType<typeof setTimeout> | undefined>,
	delayMs: number | undefined,
) {
	clearTimer(timerRef);

	if (!delayMs) {
		apply();
		return;
	}

	timerRef.current = setTimeout(() => {
		apply();
		timerRef.current = undefined;
	}, delayMs);
}

export namespace useElementVisibility {
	export interface Visible {
		threshold?: number;
	}

	export interface Proximity {
		overscan?: number;
	}

	export interface Props {
		scrollerRef: RefObject<HTMLElement | null>;
		visible?: Visible;
		proximity?: Proximity;
		delayMs?: number;
		attribute?: string;
	}
}

export function useElementVisibility({
	scrollerRef,
	visible,
	proximity,
	delayMs,
	attribute = "data-visible-item",
}: useElementVisibility.Props): createVisibilityStore.Hook {
	const storeRef = useRef(createVisibilityStore());

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
		const root = scrollerRef.current;
		if (!root) {
			console.warn("scrollerRef.current is not set");
			return;
		}

		const threshold = visible?.threshold ?? 0.005;
		const overscan = proximity?.overscan ?? 2;

		const api = storeRef.current;

		const updateId = (id: string, patch: Partial<createVisibilityStore.State>) => {
			const state = api.getState();
			const current = state.getById(id) ?? {
				visible: false,
				isVisible: false,
				top: false,
				bottom: false,
			};

			const next = {
				...current,
				...patch,
			};

			if (next.visible) {
				next.top = false;
				next.bottom = false;
			} else if (next.top || next.bottom) {
				next.visible = false;
			}

			state.setById(id, {
				...next,
				isVisible: next.visible || next.top || next.bottom,
			});

			console.log("Setting visible state for", id, {
				id,
				...next,
				isVisible: next.visible || next.top || next.bottom,
			});
		};

		const getId = (entry: IntersectionObserverEntry) => {
			return entry.target.getAttribute(attribute)?.trim() || null;
		};

		const visibleIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = getId(entry);
					if (!id) {
						continue;
					}

					delay(
						() =>
							updateId(id, {
								visible: entry.intersectionRatio > 0,
							}),
						visibleTimerRef,
						delayMs,
					);
				}
			},
			{
				root,
				threshold,
				rootMargin: "0px",
			},
		);

		const topIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = getId(entry);
					if (!id) {
						continue;
					}

					delay(
						() =>
							updateId(id, {
								top: entry.intersectionRatio > 0,
							}),
						topTimerRef,
						delayMs,
					);
				}
			},
			{
				root,
				threshold,
				//
				rootMargin: `${overscan * 100}% 0px 100% 0px`,
			},
		);

		const bottomIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = getId(entry);
					if (!id) {
						continue;
					}

					delay(
						() =>
							updateId(id, {
								bottom: entry.intersectionRatio > 0,
							}),
						bottomTimerRef,
						delayMs,
					);
				}
			},
			{
				root,
				threshold,
				//
				rootMargin: `0px 0px ${overscan * 100}% 0px`,
			},
		);

		const observe = (node: Element) => {
			if (!node.hasAttribute(attribute)) {
				return;
			}
			visibleIo.observe(node);
			topIo.observe(node);
			bottomIo.observe(node);
		};

		const unobserve = (node: Element) => {
			if (!node.hasAttribute(attribute)) {
				return;
			}
			visibleIo.unobserve(node);
			topIo.unobserve(node);
			bottomIo.unobserve(node);

			const id = node.getAttribute(attribute)?.trim();
			if (id) {
				api.getState().removeById?.(id);
			}
		};

		const mo = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type !== "childList") {
					continue;
				}

				for (const node of mutation.addedNodes) {
					if (node instanceof Element) {
						observe(node);
					}
				}
				for (const node of mutation.removedNodes) {
					if (node instanceof Element) {
						unobserve(node);
					}
				}
			}
		});

		mo.observe(root, {
			childList: true,
			subtree: false,
		});

		for (const node of Array.from(root.children)) {
			observe(node);
		}

		return () => {
			api.getState().clear();
			//
			mo.disconnect();
			//
			visibleIo.disconnect();
			topIo.disconnect();
			bottomIo.disconnect();
		};
	}, []);

	return storeRef.current;
}
