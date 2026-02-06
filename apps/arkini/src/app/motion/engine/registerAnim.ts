import type { AnimationPlaybackControlsWithThen } from "motion/react";

export namespace registerAnim {
	export interface Props {
		id: string;
		anim: AnimationPlaybackControlsWithThen;
		animsByIdRef: React.RefObject<Map<string, Set<AnimationPlaybackControlsWithThen>>>;
	}
}

export const registerAnim = ({ id, anim, animsByIdRef }: registerAnim.Props) => {
	let set = animsByIdRef.current.get(id);
	if (!set) {
		set = new Set();
		animsByIdRef.current.set(id, set);
	}
	set.add(anim);

	anim.finished.finally(() => {
		const set = animsByIdRef.current.get(id);
		if (!set) {
			return;
		}
		set.delete(anim);
		if (set.size === 0) {
			animsByIdRef.current.delete(id);
		}
	});
};
