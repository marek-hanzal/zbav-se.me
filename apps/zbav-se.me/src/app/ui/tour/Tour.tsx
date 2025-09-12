import type { Placement } from "@floating-ui/react";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { Highlighter } from "~/app/ui/highlighter/Highlighter";
import { useHighlightRectangle } from "~/app/ui/hook/useHighlightRectangle";
import { useInViewport } from "~/app/ui/hook/useInViewport";
import { Content } from "~/app/ui/tour/Content";

export namespace Tour {
	export type Step = {
		selector: string;
		title: string;
		description?: string;
		padding?: number;
		placement?: Placement;
	};

	export interface Props {
		steps: Step[];
		isOpen: boolean;
		initialStepIndex?: number;
		placement?: Placement;
		onClose?: () => void;

		holeClassName?: string;
		tooltipClassName?: string;
		backdropOpacity?: number;
	}
}

export const Tour: FC<Tour.Props> = ({
	steps,
	isOpen,
	initialStepIndex = 0,
	placement = "bottom",
	onClose,
	holeClassName = "rounded-2xl ring-2 ring-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
	tooltipClassName,
	backdropOpacity = 0.6,
}) => {
	const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);

	useEffect(() => {
		if (isOpen) setCurrentStepIndex(initialStepIndex);
	}, [
		isOpen,
		initialStepIndex,
	]);

	const currentStep = steps[currentStepIndex];

	const { targetElement, boundingRectangle } = useHighlightRectangle(
		isOpen && currentStep ? currentStep.selector : null,
	);

	const targetInView = useInViewport(targetElement, {
		threshold: 1,
	});

	// Keep the target centered if not fully in view
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

	const goToNext = useCallback(() => {
		if (currentStepIndex < steps.length - 1)
			setCurrentStepIndex((i) => i + 1);
		else {
			onClose?.();
		}
	}, [
		currentStepIndex,
		steps.length,
		onClose,
	]);

	const goToPrevious = useCallback(() => {
		setCurrentStepIndex((i) => Math.max(0, i - 1));
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose?.();
			}
			if (e.key === "ArrowRight") {
				goToNext();
			}
			if (e.key === "ArrowLeft") {
				goToPrevious();
			}
		};
		window.addEventListener("keydown", onKeyDown as any);
		return () => {
			window.removeEventListener("keydown", onKeyDown as any);
		};
	}, [
		isOpen,
		goToNext,
		goToPrevious,
		onClose,
	]);

	const highlightRect = useMemo(() => {
		if (!boundingRectangle) {
			return null;
		}
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

	if (!isOpen || !currentStep) {
		return null;
	}

	return (
		<>
			{highlightRect && (
				<Highlighter
					rect={highlightRect}
					padding={padding}
					holeClassName={holeClassName}
					containerClassName="print:hidden transition-opacity duration-[750ms] ease-out opacity-100"
					backdropOpacity={backdropOpacity}
					onBackdropClick={onClose}
				/>
			)}

			<Content
				referenceElement={targetElement}
				placement={currentStep?.placement ?? placement}
				tooltipClassName={
					tooltipClassName ??
					"rounded-2xl bg-white text-neutral-900 shadow-2xl p-4"
				}
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
							type="button"
							className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50"
							onClick={goToPrevious}
							disabled={currentStepIndex === 0}
						>
							Zpět
						</button>

						<button
							type="button"
							className="px-3 py-1 rounded-lg bg-black text-white hover:bg-neutral-800"
							onClick={goToNext}
						>
							{currentStepIndex === steps.length - 1
								? "Dokončit"
								: "Další"}
						</button>

						<button
							type="button"
							className="ml-auto px-3 py-1 rounded-lg border border-neutral-300 hover:bg-neutral-50"
							onClick={onClose}
						>
							Zavřít
						</button>
					</div>

					<div className="text-xs text-neutral-500">
						Krok {currentStepIndex + 1} / {steps.length}
					</div>
				</div>
			</Content>
		</>
	);
};
