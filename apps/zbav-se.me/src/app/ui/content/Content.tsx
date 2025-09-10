import { useCls } from "@use-pico/cls";
import {
	type FC,
	type PropsWithChildren,
	useEffect,
	useLayoutEffect,
	useRef,
} from "react";
import { ContentCls } from "~/app/ui/content/ContentCls";

export namespace Content {
	export interface Props extends ContentCls.Props<PropsWithChildren> {
		/** Délka fadu v px (přes kterou roste opacity 0→1). */
		fadePx?: number; // default 24
		/** Barva, do níž fade mizí (MUSÍ = bg scroll plochy). */
		fadeColor?: string; // např. "rgb(224 231 255)"
		/** Délka plného pásu na začátku fadu (schová šev). */
		fadeSolid?: number; // default 12
	}
}

export const Content: FC<Content.Props> = ({
	children,
	cls = ContentCls,
	tweak,
	fadePx = 18,
	fadeColor,
	fadeSolid = 4,
}) => {
	const slots = useCls(cls, tweak);

	const rootElementRef = useRef<HTMLDivElement>(null);
	const viewportElementRef = useRef<HTMLDivElement>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const topFadeElementRef = useRef<HTMLDivElement>(null);
	const bottomFadeElementRef = useRef<HTMLDivElement>(null);

	// pomocná funkce: oříznout hodnotu do intervalu <0,1>
	const clampToUnitInterval = (value: number) =>
		value < 0 ? 0 : value > 1 ? 1 : value;

	// výpočet opacity – lineárně v rámci fadePx
	const updateFadeOpacity = () => {
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
	};

	// Nastavení výšek, barev a první výpočet ještě před paintem
	useLayoutEffect(() => {
		const rootEl = rootElementRef.current;
		const viewportEl = viewportElementRef.current;
		const topFadeEl = topFadeElementRef.current;
		const bottomFadeEl = bottomFadeElementRef.current;
		if (!rootEl || !viewportEl || !topFadeEl || !bottomFadeEl) return;

		topFadeEl.style.height = `${fadePx}px`;
		bottomFadeEl.style.height = `${fadePx}px`;

		rootEl.style.setProperty("--fade-solid", `${fadeSolid}px`);
		if (fadeColor) {
			rootEl.style.setProperty("--fade-color", fadeColor);
			(viewportEl as HTMLElement).style.backgroundColor = fadeColor; // sjednocení odstínu
		}

		updateFadeOpacity(); // hned, bez transition
	}, [
		fadePx,
		fadeSolid,
		fadeColor,
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
		fadePx,
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
				<div className="min-h-full grid place-content-center">
					<div
						ref={contentContainerRef}
						className={slots.content()}
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};
