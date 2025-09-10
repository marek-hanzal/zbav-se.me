import { useCls } from "@use-pico/cls";
import {
    type FC,
    type PropsWithChildren,
    useEffect,
    useLayoutEffect, useRef
} from "react";
import { ContentCls } from "~/app/ui/content/ContentCls";

export namespace Content {
	export interface Props extends ContentCls.Props<PropsWithChildren> {
		/** Délka přechodu (px) */
		fadePx?: number; // default 24
		/** Barva, do které fade mizí (musí sedět s pozadím obsahu) */
		fadeColor?: string; // např. "rgb(224 231 255)"
		/** Délka plného pásu na začátku fadu (px) – proti sub-pixel lince */
		fadeSolid?: number; // default 8
	}
}

export const Content: FC<Content.Props> = ({
	children,
	cls = ContentCls,
	tweak,
	fadePx = 32,
	fadeColor,
	fadeSolid = 0,
}) => {
	const slots = useCls(cls, tweak);

	const rootRef = useRef<HTMLDivElement>(null);
	const vpRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const topFadeRef = useRef<HTMLDivElement>(null);
	const botFadeRef = useRef<HTMLDivElement>(null);

	// výpočet opacity – plynule v rámci fadePx
	const compute = () => {
		const vp = vpRef.current;
		const fT = topFadeRef.current;
		const fB = botFadeRef.current;
		if (!vp || !fT || !fB) return;

		const { scrollTop, scrollHeight, clientHeight } = vp;
		const max = Math.max(0, scrollHeight - clientHeight);

		if (max <= 0) {
			fT.style.opacity = "0";
			fB.style.opacity = "0";
			return;
		}

		const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
		const topO = clamp01(scrollTop / fadePx);
		const botO = clamp01((max - scrollTop) / fadePx);

		fT.style.opacity = topO.toFixed(3);
		fB.style.opacity = botO.toFixed(3);
	};

	// Inicializace stylů ještě před prvním paintem
	useLayoutEffect(() => {
		const root = rootRef.current;
		const vp = vpRef.current;
		const fT = topFadeRef.current;
		const fB = botFadeRef.current;
		if (!root || !vp || !fT || !fB) return;

		fT.style.height = `${fadePx}px`;
		fB.style.height = `${fadePx}px`;
		root.style.setProperty("--fade-solid", `${fadeSolid}px`);
		if (fadeColor) root.style.setProperty("--fade-color", fadeColor);

		// první měření (po layoutu, před paintem)
		compute();
	}, [
		fadePx,
		fadeSolid,
		fadeColor,
	]);

	useEffect(() => {
		const vp = vpRef.current;
		const content = contentRef.current;
		if (!vp) return;

		let raf = 0;
		const onScroll = () => {
			if (!raf)
				raf = requestAnimationFrame(() => {
					raf = 0;
					compute();
				});
		};

		// dvojitý rAF → po layoutu i prvním paintu (řeší fonty/scrollbars)
		const raf1 = requestAnimationFrame(() => {
			compute();
			requestAnimationFrame(compute);
		});

		// po načtení webfontů (když existují)
		// @ts-expect-error
		if (document.fonts?.ready)
			(document.fonts as any).ready.then(() => {
				// další frame po dosednutí fontů
				requestAnimationFrame(compute);
			});

		// reaguj na změny velikosti viewportu i obsahu
		const ro = new ResizeObserver(() => {
			// další frame – po layoutu
			requestAnimationFrame(compute);
		});
		ro.observe(vp);
		if (content) ro.observe(content);

		vp.addEventListener("scroll", onScroll, {
			passive: true,
		});

		return () => {
			vp.removeEventListener("scroll", onScroll);
			ro.disconnect();
			cancelAnimationFrame(raf1);
			if (raf) cancelAnimationFrame(raf);
		};
	}, [
		fadePx,
	]);

	return (
		<div
			ref={rootRef}
			className={slots.root()}
		>
			{/* overlaye nad obsahem */}
			<div
				ref={topFadeRef}
				aria-hidden
				className={slots.fadeTop()}
			/>
			<div
				ref={botFadeRef}
				aria-hidden
				className={slots.fadeBottom()}
			/>

			{/* scrollport */}
			<div
				ref={vpRef}
				className={slots.viewport()}
			>
				<div
					ref={contentRef}
					className={slots.content()}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
