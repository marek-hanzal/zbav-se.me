import { shFn } from "~/shell/fn/shFn";

export function ensureDockerFn() {
	return shFn(
		[
			"docker",
			"version",
		],
		"Docker is not available",
	);
}
