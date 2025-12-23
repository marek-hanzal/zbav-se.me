import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { createVisibilityStore } from "../store/createVisibilityStore";

function clearTimerMap(map: Map<string, ReturnType<typeof setTimeout>>) {
	for (const t of map.values()) {
		clearTimeout(t);
	}
	map.clear();
}

function delayById(
	id: string,
	apply: () => void,
	map: Map<string, ReturnType<typeof setTimeout>>,
	delayMs: number | undefined,
) {
	const existing = map.get(id);
	if (existing) {
		clearTimeout(existing);
		map.delete(id);
	}

	if (!delayMs) {
		apply();
		return;
	}

	const t = setTimeout(() => {
		apply();
		map.delete(id);
	}, delayMs);

	map.set(id, t);
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

	const visibleTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
	const proximityTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

	useEffect(() => {
		return () => {
			clearTimerMap(visibleTimers.current);
			clearTimerMap(proximityTimers.current);
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useLayoutEffect(() => {
		const root = scrollerRef.current;
		if (!root) {
			return;
		}

		const threshold = visible?.threshold ?? 0.005;
		const overscan = proximity?.overscan ?? 2;

		const store = storeRef.current;

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

					const next = entry.intersectionRatio > 0;

					delayById(
						id,
						() => store.getState().setVisible(id, next),
						visibleTimers.current,
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

		const proximityIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = getId(entry);
					if (!id) {
						continue;
					}

					const next = entry.intersectionRatio > 0;

					delayById(
						id,
						() => store.getState().setProximity(id, next),
						proximityTimers.current,
						delayMs,
					);
				}
			},
			{
				root,
				threshold,
				rootMargin: `0px 0px ${overscan * 100}% 0px`,
			},
		);

		const observe = (node: Element) => {
			if (!node.hasAttribute(attribute)) {
				return;
			}
			visibleIo.observe(node);
			proximityIo.observe(node);
		};

		const unobserve = (node: Element) => {
			if (!node.hasAttribute(attribute)) {
				return;
			}

			visibleIo.unobserve(node);
			proximityIo.unobserve(node);

			const id = node.getAttribute(attribute)?.trim();
			if (id) {
				store.getState().removeById(id);
				visibleTimers.current.delete(id);
				proximityTimers.current.delete(id);
			}
		};

		const mo = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.type !== "childList") {
					continue;
				}

				for (const n of m.addedNodes) {
					if (n instanceof Element) {
						observe(n);
					}
				}
				for (const n of m.removedNodes) {
					if (n instanceof Element) {
						unobserve(n);
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
			store.getState().clear();
			clearTimerMap(visibleTimers.current);
			clearTimerMap(proximityTimers.current);
			mo.disconnect();
			visibleIo.disconnect();
			proximityIo.disconnect();
		};
	}, []);

	return storeRef.current;
}
