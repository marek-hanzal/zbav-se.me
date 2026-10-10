import { getLogger } from "@logtape/logtape";
import { type MutateOptions, useMutation } from "@tanstack/react-query";
import { copyFn } from "~/clipboard/fn/copyFn";
import { sleepFn } from "~/timing/fn/sleepFn";

const logger = getLogger([
	"lib",
	"client",
	"hook",
	"useCopy",
]);

export namespace useCopy {
	export interface Variables {
		text: string;
	}

	export interface Props extends MutateOptions<void, Error, Variables> {
		delay?: number;
	}
}

export const useCopy = ({ onError: onErrorFn, delay = 500, ...opts }: useCopy.Props = {}) => {
	return useMutation<void, Error, useCopy.Variables>({
		mutationKey: [
			"navigator",
			"copy",
		],
		async mutationFn(text) {
			logger.trace("Copy", {
				text,
			});
			/**
			 * Synthetic slowdown to make a "copy effect".
			 */
			await sleepFn(delay);
			return copyFn(text);
		},
		onError(error, variables, onMutationResult, context) {
			logger.error("Kaboom", {
				message: error.message,
			});
			return onErrorFn?.(error, variables, onMutationResult, context);
		},
		...opts,
	});
};
