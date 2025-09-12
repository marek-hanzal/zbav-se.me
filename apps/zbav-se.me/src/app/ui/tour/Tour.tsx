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
import { useInViewport } from "~/app/ui/hook/useInViewport";

/* =========================================
     Types
     ========================================= */

export type TourStep = {
	selector: string;
	title: string;
	description?: string;
	padding?: number;
	placement?: Placement; // directly from Floating UI
};

export type TourProperties = {
	steps: TourStep[];
	/** Controlled: parent fully manages visibility. */
	isOpen: boolean;
	/** Index to start on when opening. */
	initialStepIndex?: number;
	/** Called on user-requested close (button/Escape/backdrop). */
	onClose?: () => void;

	/** Tailwind theming hooks */
	holeClassName?: string; // visuals for the hole (rounded, ring, blur…)
	tooltipClassName?: string; // tooltip surface
	containerClassName?: string; // overlay container (z-index, print)
	backdropOpacity?: number; // 0..1 (default 0.6)
};

/* =========================================
     Utilities: viewport rect tracker + in-viewport observer
     ========================================= */

/** Tracks an element's viewport rectangle; batches updates with rAF. */
function useHighlightRectangle(selector: string | null) {
	const [targetElement, setTargetElement] = useState<HTMLElement | null>(
		null,
	);
	const [boundingRectangle, setBoundingRectangle] = useState<DOMRect | null>(
		null,
	);

	// Resolve element and take an initial snapshot synchronously.
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

	// Batch frequent events into a single measurement per frame.
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

		const visualViewport = window.visualViewport;
		if (visualViewport) {
			visualViewport.addEventListener("resize", scheduleUpdate);
			visualViewport.addEventListener("scroll", scheduleUpdate);
		}

		return () => {
			if (rafIdRef.current != null)
				cancelAnimationFrame(rafIdRef.current);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			window.removeEventListener("resize", scheduleUpdate);
			window.removeEventListener("scroll", scheduleUpdate);
			if (visualViewport) {
				visualViewport.removeEventListener("resize", scheduleUpdate);
				visualViewport.removeEventListener("scroll", scheduleUpdate);
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

/* =========================================
     Tooltip (Floating UI) – stable, no size/pos animations
     ========================================= */

function FloatingTooltip({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	maxWidthPx = 420,
	margin = 16,
	classNameExtra = "", // e.g., fade classes from Tour
	children,
}: {
	referenceElement: HTMLElement | null;
	placement?: Placement;
	tooltipClassName?: string;
	maxWidthPx?: number;
	margin?: number;
	classNameExtra?: string;
	children: React.ReactNode;
}) {
	const { x, y, strategy, refs } = useFloating({
		placement,
		whileElementsMounted: floatingAutoUpdate,
		middleware: [
			floatingOffset(12),
			// prefer staying on the same side; only flip when truly necessary
			floatingShift({
				padding: margin,
				limiter: limitShift(),
			}),
			floatingFlip(),
			// keep tooltip within viewport bounds (no animations here)
			floatingSize({
				padding: margin,
				apply({ availableWidth, availableHeight, elements }) {
					const node = elements.floating as HTMLElement;
					const width = Math.min(availableWidth, maxWidthPx);
					const height = Math.max(0, availableHeight);
					Object.assign(node.style, {
						maxWidth: `${width}px`,
						maxHeight: `${height}px`,
						overflow: "auto",
						boxSizing: "border-box",
					});
				},
			}),
		],
	});

	useEffect(() => {
		if (referenceElement) refs.setReference(referenceElement);
	}, [
		referenceElement,
		refs,
	]);

	// Snap to whole pixels to avoid shimmer on fractional transforms.
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
				position: strategy, // usually 'fixed'
				top: 0,
				left: 0,
				transform: `translate3d(${tx}px, ${ty}px, 0)`,
				zIndex: 10000,
				transition: "none", // stability over flair
				willChange: "transform",
			}}
		>
			{children}
		</div>,
		document.body,
	);
}

/* =========================================
     Tour (controlled)
     ========================================= */

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
	// Reset step when opening for predictable starts.
	const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
	useEffect(() => {
		if (isOpen) setCurrentStepIndex(initialStepIndex);
	}, [
		isOpen,
		initialStepIndex,
	]);

	const currentStep = steps[currentStepIndex];

	// Track target and its rectangle
	const { targetElement, boundingRectangle } = useHighlightRectangle(
		isOpen && currentStep ? currentStep.selector : null,
	);

	// Check if the target is fully in view (threshold = 1).
	const targetInView = useInViewport(targetElement, {
		threshold: 1,
		rootMargin: "0px",
	});

	// Scroll into view when necessary
	useEffect(() => {
		if (!isOpen || !targetElement) return;
		if (!targetInView) {
			targetElement.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}
	}, [
		isOpen,
		targetElement,
		targetInView,
	]);

	// Navigation
	const requestClose = useCallback(
		() => onClose?.(),
		[
			onClose,
		],
	);
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

	// Keyboard shortcuts while open
	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") requestClose();
			if (e.key === "ArrowRight") goToNext();
			if (e.key === "ArrowLeft") goToPrevious();
		};
		window.addEventListener("keydown", onKeyDown as any);
		return () => window.removeEventListener("keydown", onKeyDown as any);
	}, [
		isOpen,
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
	const placement: Placement = currentStep?.placement ?? "bottom";

	// Simple fade-in while open. (Parent may handle fade-out timing if desired.)
	const fadeClass = isOpen
		? "transition-opacity duration-[750ms] ease-out opacity-100"
		: "opacity-0";

	if (!isOpen || !currentStep) return null;

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
