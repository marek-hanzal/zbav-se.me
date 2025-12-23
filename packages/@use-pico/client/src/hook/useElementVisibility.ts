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
		visibility?: Visibility;
		proximity?: Proximity;
		delayMs?: number;
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
	visibility,
	proximity,
	delayMs,
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

		const mo = new MutationObserver((el) => {
			console.log("Mutated!", el);
		});
		mo.observe(scrollerRef.current, {
			childList: true,
			subtree: false,
		});

		return () => {
			byIdRef.current.clear();
			mo.disconnect();
		};
	}, []);

	return {
		byIdRef,
	};
}
