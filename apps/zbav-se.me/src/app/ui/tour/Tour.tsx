import { ArrowLeftIcon, ArrowRightIcon, Button, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { translator } from "@use-pico/common";
import type { FC } from "react";
import { CardinalOrientation, Walktour, type WalktourProps } from "walktour";
import { TourCls } from "~/app/ui/tour/TourCls";

export namespace Tour {
	export interface Props extends TourCls.Props<WalktourProps> {
		//
	}
}

export const Tour: FC<Tour.Props> = ({ cls = TourCls, tweak, ...props }) => {
	const slots = useCls(cls, tweak);

	return (
		<Walktour
			disableMaskInteraction
			orientationPreferences={[
				// CardinalOrientation.NORTH,
				CardinalOrientation.NORTHWEST,
				CardinalOrientation.NORTHEAST,
			]}
			maskRadius={12}
			// transition="top .25s ease, left .25s ease, width .25s ease, height .25s ease, transform .25s ease"
			nextLabel={translator.text("Next (tour)")}
			prevLabel={translator.text("Previous (tour)")}
			closeLabel={translator.text("Close (tour)")}
			disableAutoScroll
			// renderMask={({targetInfo}) => {
			// 	return "yep";
			// }}
			customTooltipRenderer={(props) => {
				return (
					<div className={slots.root()}>
						<div>{props?.stepContent?.title}</div>
						<div>{props?.stepContent?.description}</div>
						<div className={slots.nav()}>
							<Button
								iconEnabled={ArrowLeftIcon}
								iconDisabled={ArrowLeftIcon}
								disabled={props?.stepIndex === 0}
								onClick={() => props?.prev()}
								tone="secondary"
								theme={"light"}
								size={"sm"}
							>
								<Tx label={"Previous (tour)"} />
							</Button>

							<Button
								iconEnabled={ArrowRightIcon}
								iconDisabled={ArrowRightIcon}
								disabled={
									props?.stepIndex ===
									(props?.allSteps.length || 0) - 1
								}
								onClick={() => props?.next()}
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
