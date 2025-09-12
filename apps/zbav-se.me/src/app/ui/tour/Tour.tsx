import { type ProviderProps, TourProvider } from "@reactour/tour";
import { ArrowLeftIcon, ArrowRightIcon, Button, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import { TourCls } from "~/app/ui/tour/TourCls";

export namespace Tour {
	export interface Props extends TourCls.Props<ProviderProps> {
		//
	}
}

export const Tour: FC<Tour.Props> = ({ cls = TourCls, tweak, ...props }) => {
	const slots = useCls(cls, tweak);

	return (
		<TourProvider
			defaultOpen
			showBadge={false}
			styles={
				{
					// popover({
					// 	backgroundColor: _1,
					// 	boxShadow: _3,
					// 	// padding: _4,
					// 	...props
					// }) {
					// 	return props;
					// },
				}
			}
			onClickHighlighted={(e) => {
				e.stopPropagation();
			}}
			padding={
				{
					// popover: 50,
					// wrapper: 0,
					// mask: 4,
				}
			}
			position={"left"}
			highlightedMaskClassName={"[rx:10px] [ry:10px]"}
			disableInteraction
			onClickMask={({
				currentStep,
				setCurrentStep,
				steps = [],
				setIsOpen,
			}) => {
				if (currentStep === steps.length - 1) {
					setIsOpen(false);
					return;
				}
				setCurrentStep(currentStep + 1);
			}}
			ContentComponent={(props) => {
				const {
					currentStep,
					steps,
					setCurrentStep,
					components,
					isHighlightingObserved,
					setIsOpen,
					transition,
				} = props;
				const isLastStep = currentStep === steps.length - 1;
				const content = steps[currentStep]?.content;
				const Content =
					components?.Content || (({ content }) => content);

				return (
					<div className={slots.root()}>
						<div>
							<Content
								content={
									typeof content === "function"
										? content(props)
										: content
								}
								setCurrentStep={setCurrentStep}
								currentStep={currentStep}
								isHighlightingObserved={isHighlightingObserved}
								setIsOpen={setIsOpen}
								transition={transition}
							/>
						</div>

						<div className={slots.nav()}>
							<Button
								iconEnabled={ArrowLeftIcon}
								iconDisabled={ArrowLeftIcon}
								disabled={currentStep === 0}
								onClick={() => setCurrentStep(currentStep - 1)}
								tone="secondary"
								theme={"light"}
								size={"sm"}
							>
								<Tx label={"Previous (tour)"} />
							</Button>

							<Button
								iconEnabled={ArrowRightIcon}
								iconDisabled={ArrowRightIcon}
								disabled={isLastStep}
								onClick={() => setCurrentStep(currentStep + 1)}
								tone="secondary"
								theme={"light"}
								size={"sm"}
							>
								<Tx label={"Next (tour)"} />
							</Button>
						</div>
					</div>
				);
			}}
			{...props}
		/>
	);
};
