import { spawnSync } from "node:child_process";

export function sh(
	cmd: [
		string,
		...string[],
	],
	hint: string,
) {
	const proc = spawnSync(cmd[0], cmd.slice(1), {
		encoding: "utf8",
		stdio: "pipe",
	});
	const stdout = (proc.stdout ?? "").trim();
	const stderr = (proc.stderr ?? "").trim();

	if (proc.status !== 0) {
		throw new Error(`${hint}\n${stderr}`.trim());
	}

	return {
		proc,
		stdout,
	} as const;
}
