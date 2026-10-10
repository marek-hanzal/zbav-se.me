import type { QueryClient } from "@tanstack/react-query";

export namespace withInvalidatorFn {
	export interface Invalidate<TResult = unknown> {
		invalidateFn(queryClient: QueryClient, result?: TResult): Promise<void>;
	}

	export interface Props<TResult = unknown> {
		invalidate: Invalidate<TResult>[];
	}
}

export const withInvalidatorFn = <TResult = unknown>({
	invalidate,
}: withInvalidatorFn.Props<TResult>) => {
	const invalidateFn = async (queryClient: QueryClient, result?: TResult) => {
		for (const { invalidateFn: fnFn } of invalidate) {
			await fnFn(queryClient, result);
		}
	};

	return {
		invalidateFn,
	};
};
