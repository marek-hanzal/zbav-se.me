import { sh } from "../sh/sh";

export function ensureDocker() {
	return sh(
		[
			"docker",
			"version",
		],
		"Docker is not available",
	);
}
