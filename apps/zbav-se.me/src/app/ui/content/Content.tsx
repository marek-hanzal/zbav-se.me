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
	fadeSolid = 8,
}) => {
	const slots = useCls(cls, tweak);

	const rootRef = useRef<HTMLDivElement>(null);
	const vpRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const topFadeRef = useRef<HTMLDivElement>(null);
	const botFadeRef = useRef<HTMLDivElement>(null);

	// výpočet opacity – lineárně v rámci fadePx
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
		fT.style.opacity = clamp01(scrollTop / fadePx).toFixed(3);
		fB.style.opacity = clamp01((max - scrollTop) / fadePx).toFixed(3);
	};

	// Nastavení výšek, barev a první výpočet ještě před paintem
	useLayoutEffect(() => {
		const root = rootRef.current;
		const vp = vpRef.current;
		const fT = topFadeRef.current;
		const fB = botFadeRef.current;
		if (!root || !vp || !fT || !fB) return;

		fT.style.height = `${fadePx}px`;
		fB.style.height = `${fadePx}px`;

		root.style.setProperty("--fade-solid", `${fadeSolid}px`);
		if (fadeColor) {
			root.style.setProperty("--fade-color", fadeColor);
			(vp as HTMLElement).style.backgroundColor = fadeColor; // sjednocení odstínu
		}

		compute(); // hned, bez transition
	}, [
		fadePx,
		fadeSolid,
		fadeColor,
	]);

	// Reakce na scroll/resize + jistota po prvním layoutu
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

		compute();
		const raf1 = requestAnimationFrame(compute);

		const ro = new ResizeObserver(() => compute());
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
			{/* fade overlaye (žádné transition) */}
			<div
				ref={topFadeRef}
				aria-hidden={true}
				className={slots.fadeTop()}
			/>
			<div
				ref={botFadeRef}
				aria-hidden={true}
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
