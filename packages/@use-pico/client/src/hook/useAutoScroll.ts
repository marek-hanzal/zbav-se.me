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
			trailing: true,
		},
	);

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
				subtree: true,
				characterData: true,
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
