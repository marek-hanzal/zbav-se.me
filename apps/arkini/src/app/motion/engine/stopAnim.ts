import type { AnimationPlaybackControlsWithThen } from "motion/react";

export namespace stopAnim {
	export interface Props {
		id: string;
		animsByIdRef: React.RefObject<Map<string, Set<AnimationPlaybackControlsWithThen>>>;
	}
}

export function stopAnim({ id, animsByIdRef }: stopAnim.Props) {
	const set = animsByIdRef.current.get(id);
	if (!set) {
		return;
	}
	for (const anim of set) {
		anim.stop();
	}
	animsByIdRef.current.delete(id);
}
