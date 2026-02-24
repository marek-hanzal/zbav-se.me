import { type RefObject, useLayoutEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export namespace useAutoScroll {
	export interface Props {
		containerRef: RefObject<HTMLElement | null>;
		contentRef: RefObject<HTMLElement | null>;
		enabled?: boolean;
		debounceMs?: number;
		initialBehavior?: ScrollBehavior;
		resizeBehavior?: ScrollBehavior;
	}

	export interface Result {
		scrollToEnd(behavior: ScrollBehavior): void;
	}
}

export function useAutoScroll({
	containerRef,
	contentRef,
	enabled = true,
	debounceMs = 150,
	initialBehavior = "instant",
	resizeBehavior = "smooth",
}: useAutoScroll.Props): useAutoScroll.Result {
	const scrollToEnd = useDebouncedCallback(
		(behavior: ScrollBehavior) => {
			if (!enabled) {
				return;
			}

			containerRef.current?.scrollTo({
				top: containerRef.current?.scrollHeight,
				behavior,
			});
		},
		debounceMs,
		{
			leading: true,
		},
	);

	useLayoutEffect(() => {
		if (!enabled || !containerRef.current || !contentRef.current) {
			return;
		}

		scrollToEnd(initialBehavior);
	}, [
		enabled,
		containerRef.current,
		contentRef.current,
		scrollToEnd,
		initialBehavior,
	]);

	useLayoutEffect(() => {
		if (!enabled || !contentRef.current || !containerRef.current) {
			return;
		}

		const ro = new ResizeObserver(() => {
			scrollToEnd(resizeBehavior);
		});

		ro.observe(contentRef.current);

		return () => {
			ro.disconnect();
		};
	}, [
		enabled,
		containerRef.current,
		contentRef.current,
		scrollToEnd,
		resizeBehavior,
	]);

	return {
		scrollToEnd,
	};
}
