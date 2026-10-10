import { type FC, type RefObject, useCallback, useEffect, useRef } from "react";
import { uiFadeFn } from "~/ui/fn/uiFadeFn";

const clamp01Fn = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export namespace Fade {
	export interface Props extends uiFadeFn.Component {
		scrollableRef: RefObject<HTMLElement | null>;
		height?: number;
		fade?: number;
	}
}

export const Fade: FC<Fade.Props> = ({
	height = 10,
	fade = height * 2,
	scrollableRef,
	//
	className,
}) => {
	const topFadeRef = useRef<HTMLDivElement>(null);
	const bottomFadeRef = useRef<HTMLDivElement>(null);

	const rafIdRef = useRef<number | 0>(0);
	const scheduleFn = useCallback((fnFn: () => void) => {
		if (rafIdRef.current) {
			return;
		}
		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = 0;
			fnFn();
		});
	}, []);

	const updateFn = useCallback(() => {
		const scrollable = scrollableRef.current;
		const top = topFadeRef.current;
		const bottom = bottomFadeRef.current;
		if (!scrollable || !top || !bottom) {
			return;
		}

		const { scrollTop, scrollHeight, clientHeight } = scrollable;
		const maxScrollable = Math.max(0, scrollHeight - clientHeight);

		if (maxScrollable <= 0) {
			top.style.opacity = "0";
			bottom.style.opacity = "0";
			return;
		}

		const topOpacity = clamp01Fn(scrollTop / fade);
		const bottomOpacity = clamp01Fn((maxScrollable - scrollTop) / fade);

		top.style.opacity = topOpacity.toFixed(3);
		bottom.style.opacity = bottomOpacity.toFixed(3);
	}, [
		scrollableRef,
		fade,
	]);

	useEffect(() => {
		const scrollable = scrollableRef.current;
		if (!scrollable) {
			return;
		}

		const onScrollFn = () => scheduleFn(updateFn);
		scrollable.addEventListener("scroll", onScrollFn, {
			passive: true,
		});

		const resizeObserver = new ResizeObserver(() => scheduleFn(updateFn));
		resizeObserver.observe(scrollable);

		const mutationObserver = new MutationObserver(() => scheduleFn(updateFn));
		mutationObserver.observe(scrollable, {
			childList: true,
			subtree: true,
			attributes: false,
		});

		updateFn();
		const initId = requestAnimationFrame(updateFn);

		return () => {
			scrollable.removeEventListener("scroll", onScrollFn);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			cancelAnimationFrame(initId);
			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = 0;
		};
	}, [
		scrollableRef,
		scheduleFn,
		updateFn,
	]);

	return (
		<>
			<div
				ref={topFadeRef}
				aria-hidden
				{...uiFadeFn({
					className,
				})}
				data-ui="Fade-top"
				style={{
					height,
				}}
			/>

			<div
				ref={bottomFadeRef}
				aria-hidden
				{...uiFadeFn({
					className,
				})}
				data-ui="Fade-bottom"
				style={{
					height,
				}}
			/>
		</>
	);
};
