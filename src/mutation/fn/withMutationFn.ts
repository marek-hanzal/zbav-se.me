import type { Logger } from "@logtape/logtape";
import {
	type QueryClient,
	type QueryKey,
	type UseMutationOptions,
	type UseMutationResult,
	useIsMutating,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { withInvalidatorFn } from "~/mutation/fn/withInvalidatorFn";

export namespace withMutationFn {
	export interface Meta {
		mutationId?: string;
	}

	export namespace PreMutation {
		export interface Props<TVariables> {
			variables: TVariables;
		}

		/**
		 * Result of the callback is unused
		 */
		export type Fn<TVariables> = (props: Props<TVariables>) => Promise<any>;
	}

	export namespace PostMutation {
		export interface Props<TVariables, TResult> {
			variables: TVariables;
			result: TResult;
		}

		/**
		 * Result of the callback is unused
		 */
		export type Fn<TVariables, TResult> = (props: Props<TVariables, TResult>) => Promise<any>;
	}

	/**
	 * Props for configuring a generic mutation utility.
	 *
	 * @template TVariables - Input data type for the mutation.
	 * @template TResult - Result type returned by the mutation function.
	 *
	 * @property mutationFn - The function that performs the mutation. Receives variables and returns a promise of the result.
	 * @property keys - Function to generate a query key for cache invalidation, based on the mutation variables.
	 * @property invalidator - Optional array of functions that, when called, perform additional invalidation logic using the QueryClient. Each function is awaited in sequence.
	 */
	export interface Props<TVariables, TResult> {
		/**
		 * Where to send logs if this mutation.
		 *
		 * Users only "trace" to prevent higher-level spams.
		 */
		logger: Logger;
		/**
		 * Function to perform the mutation.
		 * @param variables - The input data for the mutation.
		 * @returns A promise resolving to the mutation result.
		 */
		mutationFn(variables: TVariables): Promise<TResult>;
		/**
		 * Function to generate the query key for cache invalidation, based on the mutation variables.
		 * @param variables - The input data for the mutation.
		 * @returns The query key.
		 */
		keysFn(variables?: TVariables): QueryKey;
		/**
		 * Optional array of invalidator functions. Each receives the QueryClient and is awaited in sequence when invalidation is triggered.
		 */
		invalidate?: withInvalidatorFn.Invalidate<TResult>[];
		/**
		 * If true, whole Query Client will be cleared out; useful for login/logout to ensure everything is in place.
		 *
		 * Cache is cleared _before_ the mutation is executed.
		 */
		dropCache?: boolean;
	}

	export type UseOptions<TVariables, TResult, TError, TContext = unknown> = Omit<
		UseMutationOptions<TResult, TError, TVariables, TContext>,
		"mutationFn" | "mutationKey"
	> & {
		meta?: Meta;
		/**
		 * Optional callback called right _before_ mutationFn - this blocking the mutation itself
		 *
		 * Fails the mutation if an error is thrown.
		 */
		onPreMutationFn?: PreMutation.Fn<TVariables>;
		/**
		 * Optional callback called right _after_ mutationFn - this blocking the mutation itself (it's not a onSuccess callback)
		 */
		onPostMutationFn?: PostMutation.Fn<TVariables, TResult>;
	};

	export type PropsEx<TVariables, TResult> = Omit<
		Props<TVariables, TResult>,
		"mutationFn" | "keysFn" | "invalidate"
	>;

	export type Api<TData, TResult, TError> = ReturnType<
		typeof withMutationFn<TData, TResult, TError>
	>;
}

/**
 * Generic mutation utility for React Query.
 *
 * Wraps a mutation function, a key generator, and optional invalidators, returning helpers for useMutation and cache invalidation.
 *
 * @template TVariables - Input data type for the mutation.
 * @template TResult - Result type returned by the mutation function.
 * @param props - Mutation configuration and helpers.
 * @returns An object with:
 *   - keys: The key generator function for cache invalidation.
 *   - useMutation: A hook to perform the mutation (wraps React Query's useMutation).
 *   - useInvalidate: A hook returning a function that runs all invalidators with the current QueryClient.
 *   - invalidate: A function to run all invalidators with a provided QueryClient (for non-hook usage).
 */
export function withMutationFn<TVariables, TResult, TError>({
	logger,
	mutationFn,
	keysFn,
	invalidate: $invalidate = [],
	dropCache,
}: withMutationFn.Props<TVariables, TResult>) {
	const { invalidateFn } = withInvalidatorFn<TResult>({
		invalidate: $invalidate,
	});

	const clearCacheFn = (queryClient: QueryClient) => {
		if (dropCache) {
			queryClient.cancelQueries({
				type: "all",
			});
			queryClient.clear();
			queryClient.resetQueries();
		}
	};

	return {
		/**
		 * Returns the key generator function for the mutation.
		 */
		keysFn,
		/**
		 * React Query hook for performing the mutation.
		 * @param options - Optional mutation options (same as React Query's useMutation options, except mutationFn is always provided by this utility).
		 * @returns The result of the mutation hook.
		 */
		useMutation<TContext = unknown>(
			options?: withMutationFn.UseOptions<TVariables, TResult, TError, TContext>,
		): UseMutationResult<TResult, TError, TVariables, TContext> {
			const {
				onPreMutationFn,
				onPostMutationFn,
				onError: onErrorFn,
				...$options
			} = options ?? {};
			const queryClient = useQueryClient();

			return useMutation<TResult, TError, TVariables, TContext>({
				mutationKey: keysFn(),
				async mutationFn(variables) {
					logger.trace("useMutation::mutationFn", {
						variables,
					});

					clearCacheFn(queryClient);

					await onPreMutationFn?.({
						variables,
					});
					//
					const result = await mutationFn(variables);
					await invalidateFn(queryClient, result);
					//
					await onPostMutationFn?.({
						variables,
						result,
					});
					//
					return result;
				},
				onError(error, variables, onMutateResult, context) {
					logger.error("Kaboom", {
						error,
						variables,
					});
					onErrorFn?.(error, variables, onMutateResult, context);
				},
				...$options,
			});
		},
		useIsMutating({ mutationId }: withMutationFn.Meta = {}) {
			const count = useIsMutating({
				mutationKey: keysFn(),
				predicate: mutationId
					? ({ options: { meta } }) =>
							(meta as withMutationFn.Meta)?.mutationId === mutationId
					: undefined,
			});

			return count > 0;
		},
		/**
		 * Directly call mutation function and invalidate cache; there are no hooks or other logic here.
		 *
		 * @param queryClient
		 * @param variables
		 * @returns The result of the mutation.
		 */
		async mutateFn(queryClient: QueryClient, variables: TVariables): Promise<TResult> {
			logger.trace("useMutation::mutate", {
				variables,
			});

			const data = await mutationFn(variables);
			clearCacheFn(queryClient);
			await invalidateFn(queryClient, data);
			return data;
		},
		/**
		 * React Query hook for invalidating queries related to the mutation.
		 * @returns A function that, when called, runs all invalidators with the current QueryClient.
		 */
		useInvalidate() {
			const queryClient = useQueryClient();
			return async () => {
				logger.trace("useMutation::useInvalidate::invalidate");

				return invalidateFn(queryClient, undefined);
			};
		},
		/**
		 * Invalidate queries related to the mutation by running all invalidators with the provided QueryClient.
		 *
		 * For use outside React components. For component usage, prefer useInvalidate.
		 */
		invalidateFn,
	} as const;
}
