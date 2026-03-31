import type { FC, PropsWithChildren, ReactNode } from "react";
import { useEffect, useState } from "react";

type tState = ReactNode | null | undefined;

export namespace EmptyState {
	export interface Check {
		/**
		 * When "true", use this check as the content
		 */
		check: () => boolean | Promise<boolean>;
		render: () => ReactNode;
	}

	export interface Props extends PropsWithChildren {
		check: Check[];
	}
}

export const EmptyState: FC<EmptyState.Props> = ({ check, children }) => {
	const [state, setState] = useState<tState>(undefined);

	useEffect(() => {
		let active = true;

		const resolve = async () => {
			for (const item of check) {
				if (await item.check()) {
					if (active) {
						setState(item.render());
					}

					return;
				}
			}

			if (active) {
				setState(null);
			}
		};

		void resolve();

		return () => {
			active = false;
		};
	}, [
		check,
	]);

	if (state === undefined) {
		return null;
	}

	return state ?? children;
};
