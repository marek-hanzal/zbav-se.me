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
		 * The toast itself
		 */
		toast: Toast;
	}

	export type Fn = (props: Props) => ReactNode;
}
