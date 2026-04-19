import { getLogger } from "@logtape/logtape";
import { type MutateOptions, useMutation } from "@tanstack/react-query";
import { sleep } from "@/lib/common/sleep";
import { copy } from "./copy";

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
		//
	}
}

export const useCopy = ({ onError, ...opts }: useCopy.Props = {}) => {
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
			await sleep(500);
			return copy(text);
		},
		onError(error, variables, onMutationResult, context) {
			logger.error("Kaboom", {
				message: error.message,
			});
			return onError?.(error, variables, onMutationResult, context);
		},
		...opts,
	});
};
