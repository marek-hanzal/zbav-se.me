import { spawnSync } from "node:child_process";

export function shOptional(
	cmd: [
		string,
		...string[],
	],
) {
	const proc = spawnSync(cmd[0], cmd.slice(1), {
		encoding: "utf8",
		stdio: "pipe",
	});

	if (proc.status !== 0) {
		return null;
	}

	return {
		proc,
		stdout: (proc.stdout ?? "").trim(),
	} as const;
}
