import { sh } from "~/shell/fn/sh";

export function ensureDocker() {
	return sh(
		[
			"docker",
			"version",
		],
		"Docker is not available",
	);
}
