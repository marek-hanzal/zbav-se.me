import type { FC, PropsWithChildren, ReactNode } from "react";

export namespace EmptyState {
	export interface Check {
		/**
		 * When "true", use this check as the content
		 */
		checkFn(): boolean | Promise<boolean>;
		renderFn(): ReactNode;
	}

	export interface Props extends PropsWithChildren {
		check: Check[];
	}

	export type PropsEx = Partial<Props>;
}

export const EmptyState: FC<EmptyState.Props> = ({ check, children }) => {
	for (const item of check) {
		const result = item.checkFn();

		if (result instanceof Promise) {
			return undefined;
		}

		if (result) {
			return item.renderFn();
		}
	}

	return children;
};
