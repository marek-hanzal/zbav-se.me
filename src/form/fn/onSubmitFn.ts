import { cleanOfFn } from "~/object/fn/cleanOfFn";
import { mapEmptyToNullFn } from "~/object/fn/mapEmptyToNullFn";

export namespace onSubmitFn {
	export interface Mutation<in TValues extends object, out TOutput = any> {
		mutateAsync(variables: TValues): Promise<TOutput>;
	}

	export namespace Map {
		export interface Props<out TValues extends object, out TData extends object> {
			/**
			 * Values from the form
			 */
			values: TValues;
			/**
			 * Default cleanup function returns values: undefined => null.
			 *
			 * Result is `any`, because mutation request is not known here, also
			 * because some values ("randomly") may disappear as they're undefined,
			 * output schema may not match values provided.
			 */
			cleanupFn(values: Partial<TValues>): TData;
		}

		export type Fn<in TValues extends object, TData extends object> = (
			props: Map.Props<TValues, TData>,
		) => Promise<TData>;
	}

	export interface Props<in TValues extends object, TData extends object> {
		mutation: Mutation<TData>;
		/**
		 * Map form values to mutation request values (output of this goes directly into mutation).
		 *
		 * If you need different behavior, just pass your own map function.
		 */
		mapFn?: Map.Fn<TValues, TData>;
	}
}

export const onSubmitFn = <TValues extends object, TData extends object>({
	mutation,
	mapFn = async ({ values, cleanupFn }) => {
		return cleanupFn(values) as TData;
	},
}: onSubmitFn.Props<TValues, TData>) => {
	/**
	 * A bit strange "format", but this is for basic compatibility with TanStack Form.
	 */
	return async ({ value }: { value: TValues }) => {
		const mapped = await mapFn({
			values: value,
			cleanupFn(values) {
				return cleanOfFn(mapEmptyToNullFn(values)) as unknown as TData;
			},
		});

		return mutation.mutateAsync(mapped).catch((e) => {
			console.log("onSubmit: Mutation failed", {
				values: value,
				mapped,
			});
			console.error(e);
		});
	};
};
