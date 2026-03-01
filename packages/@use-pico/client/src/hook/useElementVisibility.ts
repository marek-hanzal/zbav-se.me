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
	delayMs = 250,
	attribute = "data-visible-item",
}: useElementVisibility.Props): createVisibilityStore.Hook {
	const storeRef = useRef(createVisibilityStore());

	const visibleTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
	const topTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
	const bottomTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

	useEffect(() => {
		return () => {
			clearTimerMap(visibleTimers.current);
			clearTimerMap(topTimers.current);
			clearTimerMap(bottomTimers.current);
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

		const getId = (entry: IntersectionObserverEntry) =>
			entry.target.getAttribute(attribute)?.trim() || null;

		/* ───────────────── visible ───────────────── */

		const visibleIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = getId(entry);
					if (!id) {
						continue;
					}

					delayById(
						id,
						() =>
							store
								.getState()
								.setVisible(
									id,
									entry.isIntersecting && entry.intersectionRatio > 0,
								),
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

		/* ───────────────── top proximity ───────────────── */

		const topIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = getId(entry);
					if (!id) {
						continue;
					}

					delayById(
						id,
						() =>
							store
								.getState()
								.setTop(id, entry.isIntersecting && entry.intersectionRatio > 0),
						topTimers.current,
						delayMs,
					);
				}
			},
			{
				root,
				threshold,
				rootMargin: `${overscan * 100}% 0px 0px 0px`,
			},
		);

		/* ───────────────── bottom proximity ───────────────── */

		const bottomIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = getId(entry);
					if (!id) {
						continue;
					}

					delayById(
						id,
						() =>
							store
								.getState()
								.setBottom(id, entry.isIntersecting && entry.intersectionRatio > 0),
						bottomTimers.current,
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
				store.getState().removeById(id);
				visibleTimers.current.delete(id);
				topTimers.current.delete(id);
				bottomTimers.current.delete(id);
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
			//
			clearTimerMap(visibleTimers.current);
			clearTimerMap(topTimers.current);
			clearTimerMap(bottomTimers.current);
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
