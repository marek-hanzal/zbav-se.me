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
		scrollToEndFn(behavior: ScrollBehavior): void;
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

	const scrollToEndFn = useThrottledCallback(
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

		const onReadyFn = () => {
			if (!containerRef.current || !contentRef.current) {
				frame = requestAnimationFrame(onReadyFn);

				return;
			}

			scrollToEndFn(initialBehavior);
		};

		onReadyFn();

		return () => {
			cancelAnimationFrame(frame);
		};
	}, [
		enabled,
		containerRef,
		contentRef,
		scrollToEndFn,
		initialBehavior,
	]);

	useLayoutEffect(() => {
		if (!enabled) {
			return;
		}

		let frame = 0;
		let disconnectFn = () => {
			//
		};

		const onReadyFn = () => {
			if (!containerRef.current || !contentRef.current) {
				frame = requestAnimationFrame(onReadyFn);

				return;
			}

			const ro = new ResizeObserver(() => {
				scrollToEndFn(resizeBehavior);
			});
			const mo = new MutationObserver(() => {
				scrollToEndFn(resizeBehavior);
			});

			ro.observe(contentRef.current);
			mo.observe(contentRef.current, {
				childList: true,
			});

			disconnectFn = () => {
				ro.disconnect();
				mo.disconnect();
			};
		};

		onReadyFn();

		return () => {
			cancelAnimationFrame(frame);
			disconnectFn();
		};
	}, [
		enabled,
		containerRef,
		contentRef,
		scrollToEndFn,
		resizeBehavior,
	]);

	return {
		scrollToEndFn,
	};
}
