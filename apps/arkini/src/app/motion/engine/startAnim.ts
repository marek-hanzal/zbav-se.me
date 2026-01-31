import {
	type AnimationPlaybackControlsWithThen,
	animate,
	type MotionValue,
	type ValueAnimationTransition,
} from "motion/react";
import { registerAnim } from "~/app/motion/engine/registerAnim";

export namespace startAnim {
	export interface Props {
		id: string;
		mv: MotionValue;
		to: number;
		options: ValueAnimationTransition<number>;
		animsByIdRef: React.RefObject<Map<string, Set<AnimationPlaybackControlsWithThen>>>;
	}
}

export function startAnim({ id, mv, to, options, animsByIdRef }: startAnim.Props) {
	const anim = animate(mv, to, options);
	registerAnim({
		id,
		anim,
		animsByIdRef,
	});
	return anim;
}
