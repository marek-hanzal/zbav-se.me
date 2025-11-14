import type { UseMutationResult } from "@tanstack/react-query";
import type { FormCls } from "./FormCls";

export namespace Form {
	export namespace Props {
		export type Mutation<TValues extends object, TOutput = any> = UseMutationResult<TOutput, any, TValues>;
	}

	export interface Props<TValues extends object> extends FormCls.Props {
		/**
		 * React query mutation; events and the other stuff
		 * can be handled there.
		 */
		mutation: Props.Mutation<TValues>;
		defaultValues?: Partial<TValues>;
	}
}
