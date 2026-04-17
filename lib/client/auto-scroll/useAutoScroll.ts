import { useThrottledCallback } from "@tanstack/react-pacer";
import { type RefObject, useLayoutEffect, useRef } from "react";

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
	debounceMs = 100,
	initialBehavior = "instant",
	resizeBehavior = "smooth",
}: useAutoScroll.Props): useAutoScroll.Result {
	const frameRef = useRef<number>(0);

	const scrollToEnd = useThrottledCallback(
		(behavior: ScrollBehavior) => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}

			frameRef.current = requestAnimationFrame(() => {
				frameRef.current = 0;

				containerRef.current?.scrollTo({
					top: containerRef.current.scrollHeight,
					behavior,
				});
			});
		},
		{
			enabled,
			wait: debounceMs,
			leading: true,
			trailing: true,
		},
	);

	useLayoutEffect(() => {
		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, []);

	useLayoutEffect(() => {
		if (!enabled) {
			return;
		}

		let frame = 0;

		const onReady = () => {
			if (!containerRef.current || !contentRef.current) {
				frame = requestAnimationFrame(onReady);

				return;
			}

			scrollToEnd(initialBehavior);
		};

		onReady();

		return () => {
			cancelAnimationFrame(frame);
		};
	}, [
		enabled,
		containerRef,
		contentRef,
		scrollToEnd,
		initialBehavior,
	]);

	useLayoutEffect(() => {
		if (!enabled) {
			return;
		}

		let frame = 0;
		let disconnect = () => {
			//
		};

		const onReady = () => {
			if (!containerRef.current || !contentRef.current) {
				frame = requestAnimationFrame(onReady);

				return;
			}

			const ro = new ResizeObserver(() => {
				scrollToEnd(resizeBehavior);
			});
			const mo = new MutationObserver(() => {
				scrollToEnd(resizeBehavior);
			});

			ro.observe(contentRef.current);
			mo.observe(contentRef.current, {
				childList: true,
				// subtree: true,
				// characterData: true,
			});

			disconnect = () => {
				ro.disconnect();
				mo.disconnect();
			};
		};

		onReady();

		return () => {
			cancelAnimationFrame(frame);
			disconnect();
		};
	}, [
		enabled,
		containerRef,
		contentRef,
		scrollToEnd,
		resizeBehavior,
	]);

	return {
		scrollToEnd,
	};
}
