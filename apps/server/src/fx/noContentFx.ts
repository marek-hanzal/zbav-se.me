import { Effect } from "effect";
import { NoContentError } from "~/error/NoContentError";

export namespace noContentFx {
	export interface Props {
		check: boolean | undefined;
		resource: string;
		message: string;
	}
}

/**
 * Just simple check which returns NoContentError if check is explicitly false
 */
export const noContentFx = ({ check, resource, message }: noContentFx.Props) => {
	return Effect.gen(function* () {
		if (check === false) {
			return yield* new NoContentError({
				resource,
				message,
			});
		}
	});
};
