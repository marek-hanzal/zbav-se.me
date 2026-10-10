import { spawnSync } from "node:child_process";

export function shQuietFn(
	cmd: [
		string,
		...string[],
	],
) {
	return spawnSync(cmd[0], cmd.slice(1), {
		stdio: "ignore",
	});
}
