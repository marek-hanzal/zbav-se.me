import type { QueryClient } from "@tanstack/react-query";

export namespace withInvalidator {
	export interface Invalidate<TResult = unknown> {
		invalidate(queryClient: QueryClient, result?: TResult): Promise<void>;
	}

	export interface Props<TResult = unknown> {
		invalidate: Invalidate<TResult>[];
	}
}

export const withInvalidator = <TResult = unknown>({
	invalidate,
}: withInvalidator.Props<TResult>) => {
	const invalidateFn = async (queryClient: QueryClient, result?: TResult) => {
		for (const { invalidate: fn } of invalidate) {
			await fn(queryClient, result);
		}
	};

	return {
		invalidate: invalidateFn,
	};
};
