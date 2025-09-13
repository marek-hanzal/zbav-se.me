import type { Placement } from "@floating-ui/react";
import {
	Action,
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	CloseIcon,
	Tx,
	Typo,
} from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { Highlighter } from "~/app/ui/highlighter/Highlighter";
import { useHighlightRectangle } from "~/app/ui/hook/useHighlightRectangle";
import { useInViewport } from "~/app/ui/hook/useInViewport";
import { Content } from "~/app/ui/tour/Content";
import { TourCls } from "~/app/ui/tour/TourCls";

export namespace Tour {
	export interface Step {
		selector: string;
		title: string;
		description?: string;
		padding?: number;
		placement?: Placement;
	}

	export interface Props extends TourCls.Props {
		steps: Step[];
		isOpen: boolean;
		initialStepIndex?: number;
		placement?: Placement;
		onClose?: () => void;

		holeClassName?: string;
		backdropOpacity?: number;
	}
}

export const Tour: FC<Tour.Props> = ({
	steps,
	isOpen,
	initialStepIndex = 0,
	placement = "bottom",
	onClose,
	backdropOpacity = 0.6,
	cls = TourCls,
	tweak,
}) => {
	const slots = useCls(cls, tweak);
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
					holeClassName={slots.hole()}
					containerClassName="print:hidden transition-opacity duration-[750ms] ease-out opacity-100"
					backdropOpacity={backdropOpacity}
					onBackdropClick={onClose}
				/>
			)}

			<Content
				contentKey={currentStepIndex}
				referenceElement={targetElement}
				placement={currentStep?.placement ?? placement}
			>
				<div className="grid gap-2">
					<div className="inline-flex items-center justify-between">
						<div>{currentStep.title}</div>
						<Action
							iconEnabled={CloseIcon}
							iconDisabled={CloseIcon}
							onClick={onClose}
							size="sm"
							tone={"neutral"}
							theme={"light"}
						/>
					</div>

					<Typo
						label={currentStep.description}
						size="sm"
						tone={"secondary"}
						theme={"light"}
					/>

					<div className={slots.nav()}>
						<Button
							iconEnabled={ArrowLeftIcon}
							iconDisabled={ArrowLeftIcon}
							onClick={goToPrevious}
							disabled={currentStepIndex === 0}
							size="sm"
						>
							<Tx label={"Previous (tour)"} />
						</Button>

						<Button
							iconEnabled={ArrowRightIcon}
							iconDisabled={ArrowRightIcon}
							onClick={goToNext}
							size="sm"
						>
							{currentStepIndex === steps.length - 1 ? (
								<Tx label={"Finish (tour)"} />
							) : (
								<Tx label={"Next (tour)"} />
							)}
						</Button>
					</div>
					<div className="text-xs text-neutral-500">
						Krok {currentStepIndex + 1} / {steps.length}
					</div>
				</div>
			</Content>
		</>
	);
};
