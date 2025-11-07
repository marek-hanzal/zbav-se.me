import type { ReactNode } from "react";
import type { createToastStore } from "./createToastStore";
import type { Toast } from "./Toast";

export namespace Render {
	export interface Props {
		/**
		 * Access to the toast store
		 */
		store: createToastStore.Store;
		/**
		 * React useId() for toasts, optional to use
		 */
		toastId: string;
		/**
		 * The toast itself
		 */
		toast: Toast;
	}

	export type Fn = (props: Props) => ReactNode;
}
