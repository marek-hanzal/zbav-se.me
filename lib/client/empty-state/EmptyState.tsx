import type { FC, PropsWithChildren, ReactNode } from "react";

export namespace EmptyState {
	export interface Check {
		/**
		 * When "true", use this check as the content
		 */
		check(): boolean | Promise<boolean>;
		render(): ReactNode;
	}

	export interface Props extends PropsWithChildren {
		check: Check[];
	}

	export type PropsEx = Partial<Props>;
}

export const EmptyState: FC<EmptyState.Props> = ({ check, children }) => {
	for (const item of check) {
		const result = item.check();

		if (result instanceof Promise) {
			return undefined;
		}

		if (result) {
			return item.render();
		}
	}

	return children;
};
