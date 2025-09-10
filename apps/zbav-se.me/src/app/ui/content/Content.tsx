import { useCls } from "@use-pico/cls";
import {
	type FC,
	type PropsWithChildren,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
} from "react";
import { ContentCls } from "~/app/ui/content/ContentCls";

const clampToUnitInterval = (value: number) =>
	value < 0 ? 0 : value > 1 ? 1 : value;

export namespace Content {
	export interface Props extends ContentCls.Props<PropsWithChildren> {}
}

export const Content: FC<Content.Props> = ({
	children,
	cls = ContentCls,
	tweak,
}) => {
	const slots = useCls(cls, tweak);

	const fadePx = 32;
	const fadeSolid = 1;

	const rootElementRef = useRef<HTMLDivElement>(null);
	const viewportElementRef = useRef<HTMLDivElement>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const topFadeElementRef = useRef<HTMLDivElement>(null);
	const bottomFadeElementRef = useRef<HTMLDivElement>(null);

	const updateFadeOpacity = useCallback(() => {
		const viewportEl = viewportElementRef.current;
		const topFadeEl = topFadeElementRef.current;
		const bottomFadeEl = bottomFadeElementRef.current;
		if (!viewportEl || !topFadeEl || !bottomFadeEl) return;

		const { scrollTop, scrollHeight, clientHeight } = viewportEl;
		const maxScrollable = Math.max(0, scrollHeight - clientHeight);

		if (maxScrollable <= 0) {
			topFadeEl.style.opacity = "0";
			bottomFadeEl.style.opacity = "0";
			return;
		}

		const topOpacity = clampToUnitInterval(scrollTop / fadePx);
		const bottomOpacity = clampToUnitInterval(
			(maxScrollable - scrollTop) / fadePx,
		);

		topFadeEl.style.opacity = topOpacity.toFixed(3);
		bottomFadeEl.style.opacity = bottomOpacity.toFixed(3);
	}, []);

	useLayoutEffect(() => {
		const rootEl = rootElementRef.current;
		const viewportEl = viewportElementRef.current;
		const topFadeEl = topFadeElementRef.current;
		const bottomFadeEl = bottomFadeElementRef.current;
		if (!rootEl || !viewportEl || !topFadeEl || !bottomFadeEl) return;

		topFadeEl.style.height = `${fadePx}px`;
		bottomFadeEl.style.height = `${fadePx}px`;

		rootEl.style.setProperty("--fade-solid", `${fadeSolid}px`);

		updateFadeOpacity(); // hned, bez transition
	}, [
		updateFadeOpacity,
	]);

	useEffect(() => {
		const viewportEl = viewportElementRef.current;
		const contentEl = contentContainerRef.current;
		if (!viewportEl) {
			return;
		}

		let rafId = 0;
		const onScroll = () => {
			if (!rafId) {
				rafId = requestAnimationFrame(() => {
					rafId = 0;
					updateFadeOpacity();
				});
			}
		};

		updateFadeOpacity();
		const firstFrameId = requestAnimationFrame(updateFadeOpacity);

		const resizeObserver = new ResizeObserver(() => updateFadeOpacity());
		resizeObserver.observe(viewportEl);
		if (contentEl) resizeObserver.observe(contentEl);

		viewportEl.addEventListener("scroll", onScroll, {
			passive: true,
		});

		return () => {
			viewportEl.removeEventListener("scroll", onScroll);
			resizeObserver.disconnect();
			cancelAnimationFrame(firstFrameId);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [
		updateFadeOpacity,
	]);

	return (
		<div
			ref={rootElementRef}
			className={slots.root()}
		>
			<div
				ref={topFadeElementRef}
				aria-hidden={true}
				className={slots.fadeTop()}
			/>
			<div
				ref={bottomFadeElementRef}
				aria-hidden={true}
				className={slots.fadeBottom()}
			/>

			<div
				ref={viewportElementRef}
				className={slots.viewport()}
			>
				<div
					ref={contentContainerRef}
					className={slots.content()}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
