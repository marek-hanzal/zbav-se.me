import { type RefObject, useEffect } from "react";

export namespace useArrowNavigation {
	export interface Props {
		ref: RefObject<HTMLElement | null>;
	}
}

export const useArrowNavigation = ({ ref }: useArrowNavigation.Props) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: One time shot, ssst
	useEffect(() => {
		const { current: node } = ref;

		if (!node) {
			return;
		}

		const handler = (e: KeyboardEvent) => {
			const key = e.key.replace("Arrow", "").toLowerCase();

			const nextId = node.dataset[`arrow${key[0]?.toUpperCase()}${key.slice(1)}`];

			if (nextId) {
				document.getElementById(nextId)?.focus();
			}
		};

		node.addEventListener("keydown", handler);
		return () => {
			return node.removeEventListener("keydown", handler);
		};
	}, []);
};
