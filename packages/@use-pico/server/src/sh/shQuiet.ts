export function shQuiet(cmd: string[]) {
	return Bun.spawnSync({
		cmd,
		stdout: "ignore",
		stderr: "ignore",
	});
}
