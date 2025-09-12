import {
	autoUpdate as floatingAutoUpdate,
	flip as floatingFlip,
	offset as floatingOffset,
	shift as floatingShift,
	size as floatingSize,
	limitShift,
	type Placement,
	useFloating,
} from "@floating-ui/react";
import type React from "react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { Highlight } from "~/app/ui/highlight/highlight";

/* ================================
     Types
     ================================ */

export type TourStep = {
	selector: string;
	title: string;
	description?: string;
	padding?: number;
	placement?:
		| "top"
		| "bottom"
		| "left"
		| "right"
		| "top-start"
		| "top-end"
		| "bottom-start"
		| "bottom-end"
		| "left-start"
		| "left-end"
		| "right-start"
		| "right-end";
};

export type TourProperties = {
	steps: TourStep[];

	/** Controlled flag. When undefined, Tour manages open state internally. */
	isOpen?: boolean;

	/** Initial step index when Tour opens first time. */
	initialStepIndex?: number;

	/** Called after fade-out completes when Tour was closed via button/Escape. */
	onClose?: () => void;

	/** Tailwind class names for theming */
	holeClassName?: string; // visuals for the hole (rounded, ring, shadow, blur…)
	tooltipClassName?: string; // tooltip surface
	containerClassName?: string; // overlay container (z-index, print)
	backdropOpacity?: number; // 0..1 darkness (default 0.6)
};

/* ================================
     Constants (fade timing)
     ================================ */

const FADE_MS = 750; // hard-coded fade duration (both in and out)

/* ================================
     Rectangle tracker (batched by rAF)
     ================================ */

function useHighlightRectangle(selector: string | null) {
	const [targetElement, setTargetElement] = useState<HTMLElement | null>(
		null,
	);
	const [boundingRectangle, setBoundingRectangle] = useState<DOMRect | null>(
		null,
	);

	useLayoutEffect(() => {
		if (!selector) {
			setTargetElement(null);
			setBoundingRectangle(null);
			return;
		}
		const el = document.querySelector(selector) as HTMLElement | null;
		setTargetElement(el);
		setBoundingRectangle(el ? el.getBoundingClientRect() : null);
	}, [
		selector,
	]);

	const rafIdRef = useRef<number | null>(null);
	const schedule = useCallback((fn: () => void) => {
		if (rafIdRef.current != null) return;
		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = null;
			fn();
		});
	}, []);

	useEffect(() => {
		if (!targetElement) return;

		const update = () =>
			setBoundingRectangle(targetElement.getBoundingClientRect());
		const scheduleUpdate = () => schedule(update);

		scheduleUpdate();

		const resizeObserver = new ResizeObserver(scheduleUpdate);
		resizeObserver.observe(targetElement);

		const mutationObserver = new MutationObserver(scheduleUpdate);
		mutationObserver.observe(document.documentElement, {
			attributes: true,
			childList: true,
			subtree: true,
		});

		window.addEventListener("resize", scheduleUpdate, {
			passive: true,
		});
		window.addEventListener("scroll", scheduleUpdate, {
			passive: true,
		});

		const vv = window.visualViewport;
		if (vv) {
			vv.addEventListener("resize", scheduleUpdate);
			vv.addEventListener("scroll", scheduleUpdate);
		}

		return () => {
			if (rafIdRef.current != null)
				cancelAnimationFrame(rafIdRef.current);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			window.removeEventListener("resize", scheduleUpdate);
			window.removeEventListener("scroll", scheduleUpdate);
			if (vv) {
				vv.removeEventListener("resize", scheduleUpdate);
				vv.removeEventListener("scroll", scheduleUpdate);
			}
		};
	}, [
		targetElement,
		schedule,
	]);

	return {
		targetElement,
		boundingRectangle,
	};
}

/* ================================
     Tooltip (Floating UI) with size guard
     ================================ */

function FloatingTooltip({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	margin = 16,
	classNameExtra = "",
	children,
}: {
	referenceElement: HTMLElement | null;
	placement?: Placement;
	tooltipClassName?: string;
	margin?: number;
	classNameExtra?: string;
	children: React.ReactNode;
}) {
	const { x, y, strategy, refs } = useFloating({
		placement,
		whileElementsMounted: floatingAutoUpdate,
		middleware: [
			floatingOffset(12),
			floatingFlip(),
			floatingShift({
				padding: margin,
				limiter: limitShift(),
			}),
			floatingSize({
				padding: margin,
				apply({ availableWidth, availableHeight, elements }) {
					const width = Math.min(availableWidth, maxWidthPx);
					const height = Math.max(0, availableHeight);
					Object.assign(elements.floating.style, {
						maxWidth: `${width}px`,
						maxHeight: `${height}px`,
					});
				},
			}),
		],
	});

	useEffect(() => {
		if (referenceElement) {
			refs.setReference(referenceElement);
		}
	}, [
		referenceElement,
		refs,
	]);

	const tx = Math.round(x ?? 0);
	const ty = Math.round(y ?? 0);

	return createPortal(
		<div
			ref={refs.setFloating}
			className={[
				tooltipClassName,
				"overflow-auto",
				"max-w-[calc(100dvw-32px)]",
				"max-h-[calc(100dvh-32px)]",
				classNameExtra,
			].join(" ")}
			style={{
				position: strategy,
				top: 0,
				left: 0,
				transform: `translate3d(${tx}px, ${ty}px, 0)`,
				zIndex: 10000,
				willChange: "transform",
			}}
		>
			{children}
		</div>,
		document.body,
	);
}

/* ================================
     Tour
     ================================ */

export function Tour({
	steps,
	isOpen,
	initialStepIndex = 0,
	onClose,
	holeClassName = "rounded-2xl ring-2 ring-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
	tooltipClassName,
	containerClassName = "print:hidden",
	backdropOpacity = 0.6,
}: TourProperties) {
	// Controlled vs uncontrolled
	const isControlled = isOpen !== undefined;
	const [internalOpen, setInternalOpen] = useState<boolean>(true);
	const desiredOpen = isControlled ? (isOpen as boolean) : internalOpen;

	// Mounted/visible states to support fade-out before unmount
	const [mounted, setMounted] = useState(false); // whether Tour should render at all
	const [visible, setVisible] = useState(false); // drives opacity 0 ↔ 1

	// Mount/unmount + fade logic reacts to desiredOpen
	useEffect(() => {
		if (desiredOpen) {
			// mount and fade-in
			setMounted(true);
			const id = requestAnimationFrame(() => setVisible(true));
			return () => cancelAnimationFrame(id);
		} else {
			// fade-out, then unmount
			setVisible(false);
			const t = setTimeout(() => setMounted(false), FADE_MS);
			return () => clearTimeout(t);
		}
	}, [
		desiredOpen,
	]);

	// Step index
	const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
	const currentStep = steps[currentStepIndex];

	// Resolve element + rect for the current step
	const { targetElement, boundingRectangle } = useHighlightRectangle(
		mounted && currentStep ? currentStep.selector : null,
	);

	// Helper to request close with fade-out, then notify parent
	const requestClose = useCallback(() => {
		// start fade-out immediately
		setVisible(false);
		// after fade completes, close for real
		window.setTimeout(() => {
			if (!isControlled) setInternalOpen(false);
			setMounted(false);
			onClose?.();
		}, FADE_MS);
	}, [
		isControlled,
		onClose,
	]);

	// Scroll target into view if needed
	useEffect(() => {
		if (!mounted || !targetElement || !boundingRectangle) return;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const inView =
			boundingRectangle.left >= 0 &&
			boundingRectangle.top >= 0 &&
			boundingRectangle.right <= vw &&
			boundingRectangle.bottom <= vh;

		if (!inView) {
			targetElement.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}
	}, [
		mounted,
		targetElement,
		boundingRectangle,
	]);

	// Navigation
	const goToNext = useCallback(() => {
		if (currentStepIndex < steps.length - 1)
			setCurrentStepIndex((i) => i + 1);
		else requestClose();
	}, [
		currentStepIndex,
		steps.length,
		requestClose,
	]);

	const goToPrevious = useCallback(() => {
		setCurrentStepIndex((i) => Math.max(0, i - 1));
	}, []);

	// Keyboard navigation
	useEffect(() => {
		if (!mounted) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") requestClose();
			if (e.key === "ArrowRight") goToNext();
			if (e.key === "ArrowLeft") goToPrevious();
		};
		window.addEventListener("keydown", onKeyDown as any);
		return () => window.removeEventListener("keydown", onKeyDown as any);
	}, [
		mounted,
		goToNext,
		goToPrevious,
		requestClose,
	]);

	// Geometry for Highlight
	const highlightRect = useMemo(() => {
		if (!boundingRectangle) return null;
		return {
			x: boundingRectangle.left,
			y: boundingRectangle.top,
			width: boundingRectangle.width,
			height: boundingRectangle.height,
		};
	}, [
		boundingRectangle,
	]);

	const padding = currentStep?.padding ?? 8;
	const placement = currentStep?.placement ?? "bottom";

	// Fade classes (static; Tailwind compiles arbitrary value literals)
	const fadeClass = `transition-opacity duration-[750ms] ease-out ${visible ? "opacity-100" : "opacity-0"}`;

	if (!mounted || !currentStep) return null;

	return (
		<>
			{highlightRect && (
				<Highlight
					rect={highlightRect}
					padding={padding}
					holeClassName={holeClassName}
					containerClassName={[
						containerClassName,
						fadeClass,
					]
						.join(" ")
						.trim()}
					backdropOpacity={backdropOpacity}
					onBackdropClick={requestClose}
				/>
			)}

			<FloatingTooltip
				referenceElement={targetElement}
				placement={placement}
				tooltipClassName={[
					tooltipClassName ??
						"rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
					fadeClass,
				].join(" ")}
			>
				<div className="grid gap-2">
					<strong className="text-base">{currentStep.title}</strong>

					{currentStep.description && (
						<div className="text-sm text-neutral-600">
							{currentStep.description}
						</div>
					)}

					<div className="mt-2 flex gap-2">
						<button
							className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50"
							onClick={goToPrevious}
							disabled={currentStepIndex === 0}
						>
							Zpět
						</button>

						<button
							className="px-3 py-1 rounded-lg bg-black text-white hover:bg-neutral-800"
							onClick={goToNext}
						>
							{currentStepIndex === steps.length - 1
								? "Dokončit"
								: "Další"}
						</button>

						<button
							className="ml-auto px-3 py-1 rounded-lg border border-neutral-300 hover:bg-neutral-50"
							onClick={requestClose}
						>
							Zavřít
						</button>
					</div>

					<div className="text-xs text-neutral-500">
						Krok {currentStepIndex + 1} / {steps.length}
					</div>
				</div>
			</FloatingTooltip>
		</>
	);
}
