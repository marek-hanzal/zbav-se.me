import { useMemo } from "react";
import { getRootLogger } from "../getRootLogger";

export namespace useLogger {
	export interface Props {
		/**
		 * Non-reactive logger name
		 */
		name:
			| string
			| [
					string,
					...string[],
			  ];
	}
}

export const useLogger = ({ name }: useLogger.Props) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: Name is intentionally not reactive
	return useMemo(() => {
		return getRootLogger(name);
	}, []);
};
